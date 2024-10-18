export class TagManager {
  getSelectedTag() {
    const selectedTag = localStorage.getItem("selectedTag");
    if (!selectedTag) {
      return "";
    }
    return JSON.parse(selectedTag);
  }

  setTag(selectedTag: string) {
    if (selectedTag === this.getSelectedTag()) {
      localStorage.removeItem("selectedTag");
    } else {
      localStorage.setItem("selectedTag", JSON.stringify(selectedTag));
    }
  }
}
export class FilterTaskUserManager {
  getFilterSelectedUser() {
    const selectedFilterUser = localStorage.getItem("selectedFilterUser");
    if (!selectedFilterUser) {
      return "";
    }
    return JSON.parse(selectedFilterUser);
  }

  setFilterSelectedUser(selectedFilterUser: string) {
    const actualFilterUser = localStorage.getItem("selectedFilterUser");
    const parsedFilterUser = actualFilterUser
      ? JSON.parse(actualFilterUser)
      : null;

    if (parsedFilterUser === selectedFilterUser) {
      localStorage.removeItem("selectedFilterUser");
    } else {
      localStorage.setItem(
        "selectedFilterUser",
        JSON.stringify(selectedFilterUser)
      );
    }
  }

  getTaskSelectedUser() {
    const selectedTaskUser = localStorage.getItem("selectedTaskUser");
    if (!selectedTaskUser) {
      return "";
    }
    return JSON.parse(selectedTaskUser);
  }

  setTaskSelectedUser(selectedTaskUser: string) {
    const actualTaskUser = localStorage.getItem("selectedTaskUser");
    const parsedTaskUser = actualTaskUser ? JSON.parse(actualTaskUser) : null;
    if (parsedTaskUser === selectedTaskUser) {
      localStorage.removeItem("selectedTaskUser");
    } else {
      localStorage.setItem(
        "selectedTaskUser",
        JSON.stringify(selectedTaskUser)
      );
    }
  }
}
export class StatusManager {
  getSelectedStatus() {
    const selectedStatus = localStorage.getItem("selectedStatus");
    if (!selectedStatus) {
      return "";
    }
    return JSON.parse(selectedStatus);
  }

  setStatus(selectedStatus: string) {
    if (selectedStatus === this.getSelectedStatus()) {
      localStorage.removeItem("selectedStatus");
    } else {
      localStorage.setItem("selectedStatus", JSON.stringify(selectedStatus));
    }
  }
}
