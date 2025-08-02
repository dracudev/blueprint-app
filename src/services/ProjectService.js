const { prisma, models } = require("../../database/config/prisma");

const ProjectService = {
  getAll: async () => {
    const projects = await models.Project.findMany({
      include: {
        client: true,
        projectItems: {
          include: {
            service: true,
          },
        },
        payments: true,
      },
    });

    return projects.map((project) => ({
      ...project,
      paidAmount: project.payments.reduce(
        (sum, payment) => sum + Number(payment.paidAmount),
        0
      ),
    }));
  },

  getById: async (id) => {
    const project = await models.Project.findUnique({
      where: { projectId: Number(id) },
      include: {
        client: true,
        projectItems: {
          include: {
            service: true,
          },
        },
        payments: true,
      },
    });

    if (project) {
      project.paidAmount = project.payments.reduce(
        (sum, payment) => sum + Number(payment.paidAmount),
        0
      );
    }

    return project;
  },

  getByUser: async (user) => {
    const client = await models.Client.findFirst({
      where: { email: user.email },
    });
    if (!client) return [];

    const projects = await models.Project.findMany({
      where: { clientId: client.clientId },
      include: {
        client: true,
        projectItems: {
          include: {
            service: true,
          },
        },
        payments: true,
      },
    });

    return projects.map((project) => ({
      ...project,
      paidAmount: project.payments.reduce(
        (sum, payment) => sum + Number(payment.paidAmount),
        0
      ),
    }));
  },

  create: async (data) => {
    const mappedData = {
      clientId: Number(data.clientId || data.client_id),
      jobStatus: data.jobStatus || data.job_status || "RECEIVED",
      totalAmount: data.totalAmount || data.total_amount || 0,
    };

    const cleanData = Object.fromEntries(
      Object.entries(mappedData).filter(([_, value]) => value !== undefined)
    );

    let services = [];
    if (data.services) {
      try {
        services =
          typeof data.services === "string"
            ? JSON.parse(data.services)
            : data.services;
      } catch (error) {
        console.error("Error parsing services data:", error);
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.create({
        data: cleanData,
      });

      if (data.paid_amount !== undefined) {
        const paidAmount = Number(data.paid_amount || 0);

        if (paidAmount > 0) {
          await tx.payment.create({
            data: {
              projectId: project.projectId,
              paidAmount: paidAmount,
              paymentStatus:
                paidAmount >= Number(project.totalAmount)
                  ? "PAID"
                  : "PARTIALLY_PAID",
            },
          });
        }
      }

      if (services && services.length > 0) {
        const projectItems = services.map((service) => ({
          projectId: project.projectId,
          serviceId: Number(service.serviceId || service.service_id),
          quantity: Number(service.quantity || 1),
          unitPrice: Number(service.unitPrice || service.unit_price || 0),
        }));

        await tx.projectItem.createMany({
          data: projectItems,
        });

        if (!data.totalAmount && !data.total_amount) {
          const calculatedTotal = projectItems.reduce(
            (sum, item) => sum + item.quantity * Number(item.unitPrice),
            0
          );

          await tx.project.update({
            where: { projectId: project.projectId },
            data: { totalAmount: calculatedTotal },
          });
        }
      }

      return project;
    });

    return result;
  },

  update: async (id, data) => {
    const mappedData = {};

    if (data.clientId || data.client_id) {
      mappedData.clientId = Number(data.clientId || data.client_id);
    }

    if (data.jobStatus || data.job_status) {
      mappedData.jobStatus = data.jobStatus || data.job_status;
    }

    if (data.totalAmount !== undefined || data.total_amount !== undefined) {
      mappedData.totalAmount = Number(
        data.totalAmount || data.total_amount || 0
      );
    }

    const cleanData = Object.fromEntries(
      Object.entries(mappedData).filter(([_, value]) => value !== undefined)
    );

    let services = [];
    if (data.services) {
      try {
        services =
          typeof data.services === "string"
            ? JSON.parse(data.services)
            : data.services;
      } catch (error) {
        console.error("Error parsing services data:", error);
      }
    }

    const result = await prisma.$transaction(async (tx) => {
      const project = await tx.project.update({
        where: { projectId: Number(id) },
        data: cleanData,
      });

      if (data.paid_amount !== undefined) {
        const paidAmount = Number(data.paid_amount || 0);

        const existingPayment = await tx.payment.findFirst({
          where: { projectId: Number(id) },
        });

        if (existingPayment) {
          await tx.payment.update({
            where: { paymentId: existingPayment.paymentId },
            data: {
              paidAmount: paidAmount,
              paymentStatus:
                paidAmount > 0
                  ? paidAmount >= Number(project.totalAmount)
                    ? "PAID"
                    : "PARTIALLY_PAID"
                  : "UNPAID",
            },
          });
        } else if (paidAmount > 0) {
          await tx.payment.create({
            data: {
              projectId: Number(id),
              paidAmount: paidAmount,
              paymentStatus:
                paidAmount >= Number(project.totalAmount)
                  ? "PAID"
                  : "PARTIALLY_PAID",
            },
          });
        }
      }

      if (data.services !== undefined) {
        await tx.projectItem.deleteMany({
          where: { projectId: Number(id) },
        });

        if (services && services.length > 0) {
          const projectItems = services.map((service) => ({
            projectId: Number(id),
            serviceId: Number(service.serviceId || service.service_id),
            quantity: Number(service.quantity || 1),
            unitPrice: Number(service.unitPrice || service.unit_price || 0),
          }));

          await tx.projectItem.createMany({
            data: projectItems,
          });

          if (!data.totalAmount && !data.total_amount) {
            const calculatedTotal = projectItems.reduce(
              (sum, item) => sum + item.quantity * Number(item.unitPrice),
              0
            );

            await tx.project.update({
              where: { projectId: Number(id) },
              data: { totalAmount: calculatedTotal },
            });
          }
        }
      }

      return project;
    });

    return result;
  },

  remove: async (id) => {
    return models.Project.delete({ where: { projectId: Number(id) } });
  },
};

module.exports = ProjectService;
