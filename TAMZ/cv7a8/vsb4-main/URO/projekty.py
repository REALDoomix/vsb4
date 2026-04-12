import tkinter as tk
from tkinter import ttk, messagebox
from datetime import datetime

WINDOW_TITLE = "Pseudo calendar"
WINDOW_SIZE = "1280x720"
COLUMNS = ("Date", "Time", "Place", "Name", "Description", "Priority")
VALID_PRIORITIES = ("High", "Medium", "Low")
SAMPLE_DATA = [
    ("2026-03-17", "10:00 AM", "VŠB", "Sleeping", "Soft skills class", "Low"),
    ("2026-03-18", "2:00 PM", "Home", "Work on URO project", "I need to finish all important stuff within the project", "Medium"),
    ("2026-03-20", "12:00 PM", "Home", "Project Deadline", "Submit the TKINTER project for subject URO", "High"),
    ("2026-04-02", "7:15 AM", "VŠB", "Presenting URO project", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","High"),
    ("2026-04-03", "9:15AM", "Home", "Make breakfast", "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.","Low"),
]


class CalendarApp:
    def __init__(self, root):
        self.root = root
        self.root.title(WINDOW_TITLE)
        self.root.geometry(WINDOW_SIZE)
        self.error_label = None
        self.selected_item = None
        self.setup_ui()
        self.load_sample_data()

    def setup_ui(self):
        self.configure_grid()
        self.create_frames()
        self.create_search_bar()
        self.create_tree_view()
        self.create_event_details_panel()
        self.create_buttons()

    def configure_grid(self):
        self.root.grid_columnconfigure(0, weight=7)
        self.root.grid_columnconfigure(1, weight=2)
        self.root.grid_rowconfigure(0, weight=0)
        self.root.grid_rowconfigure(1, weight=1)
        self.root.grid_rowconfigure(2, weight=0)

    def create_frames(self):
        self.left_frame = tk.Frame(self.root, bg="gray")
        self.left_frame.grid(row=1, column=0, sticky="nsew", padx=5, pady=5)

        self.right_frame = tk.Frame(self.root, bg="gray")
        self.right_frame.grid(row=1, column=1, sticky="nsew", padx=5, pady=5)

    def create_search_bar(self):
        search_frame = tk.Frame(self.root, bg="lightgrey")
        search_frame.grid(row=0, column=0, columnspan=2, sticky="ew", padx=5, pady=(5, 0))

        tk.Label(search_frame, text="Search by Event Name:", bg="lightgrey").grid(
            row=0, column=0, padx=(10, 5)
        )

        self.search_var = tk.StringVar()
        search_entry = tk.Entry(search_frame, textvariable=self.search_var)
        search_entry.grid(row=0, column=1, sticky="ew", padx=(0, 5))
        search_entry.bind("<Return>", lambda e: self.search_events())

        tk.Button(search_frame, text="Search", command=self.search_events).grid(
            row=0, column=2, padx=(5, 10)
        )

        search_frame.grid_columnconfigure(1, weight=1)

    def create_tree_view(self):
        tree_frame = tk.Frame(self.left_frame)
        tree_frame.pack(fill="both", expand=True, padx=10, pady=10)

        self.tree = ttk.Treeview(
            tree_frame, columns=COLUMNS, show="headings", height=15
        )

        column_widths = {"Date": 100, "Time": 80, "Place": 100, "Name": 150, "Description": 200, "Priority": 70}
        for col in COLUMNS:
            self.tree.heading(col, text=col)
            self.tree.column(col, width=column_widths.get(col, 100))

        scrollbar = ttk.Scrollbar(tree_frame, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscroll=scrollbar.set)

        self.tree.grid(row=0, column=0, sticky="nsew")
        scrollbar.grid(row=0, column=1, sticky="ns")

        tree_frame.grid_rowconfigure(0, weight=1)
        tree_frame.grid_columnconfigure(0, weight=1)

        self.tree.bind("<<TreeviewSelect>>", self.on_tree_select)

    def create_event_details_panel(self):
        tk.Label(
            self.right_frame, text="Event Details", bg="gray", font=("Arial", 12, "bold")
        ).pack(pady=10)

        self.event_detail_text = tk.Text(
            self.right_frame, height=20, width=40, font=("Arial", 10), wrap="word"
        )
        self.event_detail_text.pack(fill="both", expand=True, padx=10, pady=10)
        self.event_detail_text.config(state="disabled")

        button_frame = tk.Frame(self.right_frame, bg="gray")
        button_frame.pack(padx=10, pady=10, anchor="center")

        tk.Button(
            button_frame, text="Edit Event", command=self.open_edit_event_dialog,
            font=("Arial", 10), bg="blue", fg="white"
        ).pack(side="left", padx=5)

        tk.Button(
            button_frame, text="Delete Event", command=self.delete_event_with_confirmation,
            font=("Arial", 10), bg="red", fg="white"
        ).pack(side="left", padx=5)

    def create_buttons(self):
        button_frame = tk.Frame(self.root)
        button_frame.grid(row=2, column=0, columnspan=2, sticky="ew", padx=5, pady=5)

        tk.Button(button_frame, text="Add Event", command=self.open_add_event_dialog).pack(
            side="left", padx=5
        )

    def load_sample_data(self):
        priority_order = {"High": 1, "Medium": 2, "Low": 3}
        sorted_data = sorted(
            SAMPLE_DATA,
            key=lambda x: priority_order.get(x[5], 99)
        )
        for event_data in sorted_data:
            self.tree.insert("", "end", values=event_data)

    def on_tree_select(self, event):
        selected = self.tree.selection()
        if selected:
            self.selected_item = selected[0]
            item = self.tree.item(selected[0])
            values = item["values"]
            self.display_event_details(values)

    def display_event_details(self, values):
        self.event_detail_text.config(state="normal")
        self.event_detail_text.delete("1.0", tk.END)

        details = (
            f"Date: {values[0]}\n"
            f"Time: {values[1]}\n"
            f"Place: {values[2]}\n"
            f"Event: {values[3]}\n"
            f"Description: {values[4]}\n"
            f"Priority: {values[5]}\n"
        )
        self.event_detail_text.insert("1.0", details)
        self.event_detail_text.config(state="disabled")

    def search_events(self):
        search_term = self.search_var.get().strip().lower()

        for item in self.tree.get_children():
            self.tree.delete(item)

        for event_data in SAMPLE_DATA:
            if not search_term or search_term in event_data[3].lower():
                self.tree.insert("", "end", values=event_data)

    def open_add_event_dialog(self):
        dialog = tk.Toplevel(self.root)
        dialog.title("Add New Event")
        dialog.geometry("400x600")


        form_frame = tk.Frame(dialog)
        form_frame.pack(fill="both", expand=True, padx=15, pady=15)

        fields = {
            "Date (YYYY-MM-DD)": "date",
            "Time (HH:MM AM/PM)": "time",
            "Place": "place",
            "Event Name": "name",
            "Description": "description",
            "Priority (High/Medium/Low)": "priority",
        }

        entries = {}
        for label_text, field_name in fields.items():
            tk.Label(form_frame, text=label_text, font=("Arial", 10)).pack(
                anchor="w", pady=(10, 2)
            )
            entry = tk.Entry(form_frame, font=("Arial", 10))
            entry.pack(fill="x", pady=(0, 5))
            entries[field_name] = entry

        error_label = tk.Label(form_frame, text="", fg="red", font=("Arial", 9))
        error_label.pack(pady=10)

        def add_event():
            error_label.config(text="")

            date = entries["date"].get().strip()
            time = entries["time"].get().strip()
            place = entries["place"].get().strip()
            name = entries["name"].get().strip()
            description = entries["description"].get().strip()
            priority = entries["priority"].get().strip()

            if not all([date, time, place, name, description, priority]):
                error_label.config(text="Please fill in all fields.")
                return

            if not self.validate_date(date):
                error_label.config(text="Invalid date format. Use YYYY-MM-DD.")
                return

            if priority not in VALID_PRIORITIES:
                error_label.config(text=f"Priority must be one of: {', '.join(VALID_PRIORITIES)}")
                return

            SAMPLE_DATA.append((date, time, place, name, description, priority))
            self.refresh_tree_view()
            dialog.destroy()

        tk.Button(form_frame, text="Add Event", command=add_event, font=("Arial", 10)).pack(
            pady=15
        )

    def delete_event_with_confirmation(self):
        if not self.selected_item:
            messagebox.showwarning("No Selection", "Please select an event to delete.")
            return

        result = messagebox.askyesno(
            "Confirm Deletion",
            "Are you sure you want to delete this event?"
        )

        if result:
            item = self.tree.item(self.selected_item)
            values = tuple(item["values"])
            if values in SAMPLE_DATA:
                SAMPLE_DATA.remove(values)
            self.tree.delete(self.selected_item)
            self.event_detail_text.config(state="normal")
            self.event_detail_text.delete("1.0", tk.END)
            self.event_detail_text.config(state="disabled")
            self.selected_item = None

    def delete_event(self):
        self.delete_event_with_confirmation()

    def open_edit_event_dialog(self):
        if not self.selected_item:
            messagebox.showwarning("No Selection", "Please select an event to edit.")
            return

        item = self.tree.item(self.selected_item)
        values = item["values"]

        dialog = tk.Toplevel(self.root)
        dialog.title("Edit Event")
        dialog.geometry("400x600")

        form_frame = tk.Frame(dialog)
        form_frame.pack(fill="both", expand=True, padx=15, pady=15)

        fields = {
            "Date (YYYY-MM-DD)": "date",
            "Time (HH:MM AM/PM)": "time",
            "Place": "place",
            "Event Name": "name",
            "Description": "description",
            "Priority (High/Medium/Low)": "priority",
        }

        entries = {}
        field_values = [values[0], values[1], values[2], values[3], values[4], values[5]]
        for (label_text, field_name), field_value in zip(fields.items(), field_values):
            tk.Label(form_frame, text=label_text, font=("Arial", 10)).pack(
                anchor="w", pady=(10, 2)
            )
            entry = tk.Entry(form_frame, font=("Arial", 10))
            entry.insert(0, field_value) 
            entry.pack(fill="x", pady=(0, 5))
            entries[field_name] = entry

        error_label = tk.Label(form_frame, text="", fg="red", font=("Arial", 9))
        error_label.pack(pady=10)

        def update_event():
            error_label.config(text="")

            date = entries["date"].get().strip()
            time = entries["time"].get().strip()
            place = entries["place"].get().strip()
            name = entries["name"].get().strip()
            description = entries["description"].get().strip()
            priority = entries["priority"].get().strip()

            if not all([date, time, place, name, description, priority]):
                error_label.config(text="Please fill in all fields.")
                return

            if not self.validate_date(date):
                error_label.config(text="Invalid date format. Use YYYY-MM-DD.")
                return

            if priority not in VALID_PRIORITIES:
                error_label.config(text=f"Priority must be one of: {', '.join(VALID_PRIORITIES)}")
                return

            old_values = tuple(values)
            if old_values in SAMPLE_DATA:
                SAMPLE_DATA.remove(old_values)

            new_values = (date, time, place, name, description, priority)
            SAMPLE_DATA.append(new_values)
            self.refresh_tree_view()
            self.display_event_details(new_values)
            dialog.destroy()

        tk.Button(form_frame, text="Update Event", command=update_event, font=("Arial", 10)).pack(
            pady=15
        )

    def refresh_tree_view(self):
        priority_order = {"High": 1, "Medium": 2, "Low": 3}
        sorted_data = sorted(
            SAMPLE_DATA,
            key=lambda x: priority_order.get(x[5], 99)
        )
        
        for item in self.tree.get_children():
            self.tree.delete(item)
        
        for event_data in sorted_data:
            self.tree.insert("", "end", values=event_data)

    @staticmethod
    def validate_date(date_str):
        try:
            datetime.strptime(date_str, "%Y-%m-%d")
            return True
        except ValueError:
            return False


if __name__ == "__main__":
    root = tk.Tk()
    app = CalendarApp(root)
    root.mainloop()