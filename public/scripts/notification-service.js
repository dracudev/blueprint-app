/**
 * Notification System for user feedback
 * Provides clean, accessible notifications for CRUD operations
 */
class NotificationService {
  constructor() {
    this.container = null;
    this.init();
  }

  init() {
    if (!document.querySelector(".notification-container")) {
      this.container = document.createElement("div");
      this.container.className = "notification-container";
      this.container.setAttribute("role", "region");
      this.container.setAttribute("aria-label", "Notifications");
      document.body.appendChild(this.container);
    } else {
      this.container = document.querySelector(".notification-container");
    }
  }

  /**
   * Show a notification
   * @param {string} message
   * @param {string} type - success, error, warning, info
   * @param {number} duration - milliseconds to show notification
   */
  show(message, type = "info", duration = 5000) {
    const notification = document.createElement("div");
    notification.className = `notification notification--${type}`;
    notification.setAttribute("role", "alert");
    notification.setAttribute("aria-live", "polite");

    const icon = this.getIcon(type);
    notification.innerHTML = `
      <div class="notification__content">
        <span class="notification__icon">${icon}</span>
        <span class="notification__message">${message}</span>
        <button class="notification__close" aria-label="Close notification" type="button">
          <span aria-hidden="true">&times;</span>
        </button>
      </div>
    `;

    this.container.appendChild(notification);

    const closeBtn = notification.querySelector(".notification__close");
    closeBtn.addEventListener("click", () => this.remove(notification));

    if (duration > 0) {
      setTimeout(() => this.remove(notification), duration);
    }

    requestAnimationFrame(() => {
      notification.classList.add("notification--show");
    });

    return notification;
  }

  remove(notification) {
    if (notification && notification.parentNode) {
      notification.classList.add("notification--hide");
      setTimeout(() => {
        if (notification.parentNode) {
          notification.parentNode.removeChild(notification);
        }
      }, 300);
    }
  }

  getIcon(type) {
    const icons = {
      success: "✓",
      error: "✕",
      warning: "⚠",
      info: "ℹ",
    };
    return icons[type] || icons.info;
  }

  // Convenience methods
  success(message, duration) {
    return this.show(message, "success", duration);
  }

  error(message, duration) {
    return this.show(message, "error", duration);
  }

  warning(message, duration) {
    return this.show(message, "warning", duration);
  }

  info(message, duration) {
    return this.show(message, "info", duration);
  }

  clear() {
    const notifications = this.container.querySelectorAll(".notification");
    notifications.forEach((notification) => this.remove(notification));
  }
}

window.notificationService = new NotificationService();
