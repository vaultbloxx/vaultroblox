import { create } from "zustand";
import { toast } from "react-hot-toast";
export const useUtilsStore = create((set) => ({
  shops: [],
  isGettingShopForLimitedUpload: false,
  isCreatingNewLimited: false,
  isUpdatingUser: false,

  item: null,
  isGettingItem: false,
  errorMessage: null,
  getItem: async (url, total, urlModalId, summaryModalId) => {
    set({ isGettingItem: true });
    set({ errorMessage: null });
    try {
      const response = await fetch("/api/rumman/v1/utils/get-item-info", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ url, total }),
      });
      const data = await response.json();

      if (response.ok) {
        set({ item: data });
        // ✅ directly handle modals here
        document.getElementById(urlModalId)?.close();
        document.getElementById(summaryModalId)?.showModal();
      } else {
        set({ errorMessage: data.error || "An unknown error occurred" });

        set({ item: null });
      }
    } catch (error) {
      set({ item: null });
    } finally {
      set({ isGettingItem: false });
    }
  },

  getShops: async (searchTerm = "") => {
    set({ isGettingShopForLimitedUpload: true });
    try {
      const response = await fetch("/api/rumman/v1/admin/get-shops", {
        params: { search: searchTerm },
      });
      const data = await response.json();
      if (response.ok) {
        set({ shops: data });
      }
    } catch (error) {
      console.log("Error getting shops:", error);
    } finally {
      set({ isGettingShopForLimitedUpload: false });
    }
  },
  createNewLimited: async (formData) => {
    set({ isCreatingNewLimited: true });
    try {
      const response = await fetch("/api/rumman/v1/admin/create-limited", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("Limited created successfully");
      }
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      console.log("Error creating limiteds:", error);
    } finally {
      set({ isCreatingNewLimited: false });
    }
  },
  updateUser: async (formData) => {
    set({ isUpdatingUser: true });
    try {
      const response = await fetch("/api/rumman/v1/admin/update-user", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await response.json();
      if (response.ok) {
        toast.success("User updated successfully");
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      toast.error("Error updating user");
      console.log("Error updating user:", error);
    } finally {
      set({ isUpdatingUser: false });
    }
  },

  limited: null,
  isGettingLimited: false,

  getLimitedByAssetId: async (assetId) => {
    set({ isGettingLimited: true, limited: null });
    try {
      const response = await fetch(
        `/api/rumman/v1/admin/get-limited-by-assetId/${assetId}`
      );
      const data = await response.json();

      if (response.ok) {
        set({ limited: data });
      } else {
        set({ limited: null });
        toast.error(data.error || "Failed to fetch limited data");
      }
    } catch (error) {
      console.error("Error fetching limited:", error);
      set({ limited: null });
      toast.error("Something went wrong while fetching limited");
    } finally {
      set({ isGettingLimited: false });
    }
  },
}));
