// const API_BASE_URL = "http://localhost:8000/api";

// class ContactAPI {
//   constructor() {
//     this.baseURL = API_BASE_URL;
//   }

//   async request(endpoint, options = {}) {
//     const url = `${this.baseURL}${endpoint}`;
//     const config = {
//       headers: {
//         "Content-Type": "application/json",
//         ...options.headers,
//       },
//       ...options,
//     };

//     try {
//       const response = await fetch(url, config);

//       if (!response.ok) {
//         const errorData = await response.json().catch(() => ({}));
//         throw new Error(
//           errorData.message ||
//             errorData.detail ||
//             `HTTP error! status: ${response.status}`
//         );
//       }

//       // For DELETE requests that might not return content
//       if (response.status === 204) {
//         return { success: true };
//       }

//       return await response.json();
//     } catch (error) {
//       console.error(`API request failed for ${endpoint}:`, error);
//       throw error;
//     }
//   }

//   // Send a new contact message
//   async sendMessage(messageData) {
//     return this.request("/contact/", {
//       method: "POST",
//       body: JSON.stringify(messageData),
//     });
//   }

//   // Get all contact messages (admin only)
//   async getMessages() {
//     return this.request("/contact/messages/");
//   }

//   // Get a specific message by ID (admin only)
//   async getMessage(messageId) {
//     return this.request(`/contact/messages/${messageId}/`);
//   }

//   // Mark message as read (admin only)
//   async markAsRead(messageId) {
//     return this.request(`/contact/messages/${messageId}/`, {
//       method: "PATCH",
//       body: JSON.stringify({ is_read: true }),
//     });
//   }

//   // Delete a message (admin only)
//   async deleteMessage(messageId) {
//     return this.request(`/contact/messages/${messageId}/`, {
//       method: "DELETE",
//     });
//   }

//   // Get message statistics (admin only)
//   async getMessageStats() {
//     return this.request("/contact/messages/stats/");
//   }
// }

// // Create and export a singleton instance
// export const contactAPI = new ContactAPI();

// // Also export the class for testing or custom instances
// export default ContactAPI;

const API_BASE_URL = "http://localhost:8000/api";

class ContactAPI {
  constructor() {
    this.baseURL = API_BASE_URL;
  }

  async request(endpoint, options = {}) {
    const url = `${this.baseURL}${endpoint}`;
    const config = {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(
          errorData.message ||
            errorData.detail ||
            `HTTP error! status: ${response.status}`
        );
      }

      // For DELETE requests that might not return content
      if (response.status === 204) {
        return { success: true };
      }

      return await response.json();
    } catch (error) {
      console.error(`API request failed for ${endpoint}:`, error);
      throw error;
    }
  }

  // Send a new contact message
  async sendMessage(messageData) {
    return this.request("/contact/", {
      method: "POST",
      body: JSON.stringify(messageData),
    });
  }

  // Get all contact messages
  async getMessages() {
    return this.request("/contact/messages/");
  }

  // Get a specific message by ID
  async getMessage(messageId) {
    return this.request(`/contact/messages/${messageId}/`);
  }

  // Mark message as read
  async markAsRead(messageId) {
    return this.request(`/contact/messages/${messageId}/`, {
      method: "PATCH",
      body: JSON.stringify({ is_read: true }),
    });
  }

  // Delete a message
  async deleteMessage(messageId) {
    return this.request(`/contact/messages/${messageId}/`, {
      method: "DELETE",
    });
  }

  // Get message statistics
  async getMessageStats() {
    return this.request("/contact/messages/stats/");
  }
}

// Create and export a singleton instance
export const contactAPI = new ContactAPI();

// Also export the class for testing or custom instances
export default ContactAPI;
