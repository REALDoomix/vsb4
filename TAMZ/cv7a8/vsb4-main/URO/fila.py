# -*- coding: utf-8 -*-

from tkinter import *
from tkinter import ttk, messagebox

LOGIN = "MAJ0187"

SAMPLE_DATA = [
    {"nazev": "MAJALES",    "datum": "20.5.2026", "misto": "OSTRAVA", "technika": 67, "lidi": 420, "budget": 45000},
    {"nazev": "BEATS4LOVE", "datum": "23.6.2026", "misto": "OSTRAVA", "technika": 30, "lidi": 4,   "budget": 50000},
]

class App:
    def __init__(self, root: Tk):
        self.root = root
        root.title("URO – Seznam akcí")
        root.geometry("1050x560")

        root.minsize(900, 500)

        self.style = ttk.Style()
        self.style.theme_use("aqua")
        self.style.configure("Treeview", rowheight=28, font=("Arial", 10))
        self.style.configure("Treeview.Heading", font=("Arial", 10, "bold"))
        self.style.configure("TButton", padding=6)
        self.style.configure("TLabel", font=("Arial", 10))
        self.style.configure("Header.TLabel", font=("Arial", 10, "bold"))

        self.data = SAMPLE_DATA[:]
        self.selected = None
        self.current_rows = []

        # ================= TOP: filter + add button =================
        top = Frame(root, padx=10, pady=8)
        top.pack(fill=X)

        ttk.Label(top, text="NAZEV", style="Header.TLabel").grid(row=0, column=0, sticky="w")
        ttk.Label(top, text="DATUM", style="Header.TLabel").grid(row=0, column=1, sticky="w", padx=(10, 0))
        ttk.Label(top, text="MISTO", style="Header.TLabel").grid(row=0, column=2, sticky="w", padx=(10, 0))

        self.v_name = StringVar()
        self.v_date = StringVar()
        self.v_place = StringVar()

        ttk.Entry(top, textvariable=self.v_name, width=18).grid(row=1, column=0, sticky="w")
        ttk.Entry(top, textvariable=self.v_date, width=12).grid(row=1, column=1, sticky="w", padx=(10, 0))
        ttk.Entry(top, textvariable=self.v_place, width=16).grid(row=1, column=2, sticky="w", padx=(10, 0))

        ttk.Button(top, text="HLEDAT", command=self.apply_filter).grid(row=1, column=3, padx=(12, 0))
        ttk.Button(top, text="PRIDAT AKCI", command=lambda: self.open_form_window(mode="add")).grid(row=1, column=4, padx=(12, 0))

        # ================= MAIN: table left + detail right =================
        main = Frame(root, padx=10, pady=10)
        main.pack(fill=BOTH, expand=True)

        left = Frame(main)
        left.pack(side=LEFT, fill=BOTH, expand=True)

        ttk.Label(left, text="SEZNAM AKCI", style="Header.TLabel").pack(anchor="w")

        table_wrap = Frame(left)
        table_wrap.pack(fill=BOTH, expand=True, pady=(6, 0))

        cols = ("nazev", "datum", "misto", "lidi", "budget")
        self.tree = ttk.Treeview(table_wrap, columns=cols, show="headings", selectmode="browse")
        self.tree.heading("nazev", text="NAZEV")
        self.tree.heading("datum", text="DATUM")
        self.tree.heading("misto", text="MISTO")
        self.tree.heading("lidi", text="POCET LIDI")
        self.tree.heading("budget", text="BUDGET")

        self.tree.column("nazev", width=220)
        self.tree.column("datum", width=110)
        self.tree.column("misto", width=140)
        self.tree.column("lidi", width=110)
        self.tree.column("budget", width=110)

        yscroll = ttk.Scrollbar(table_wrap, orient="vertical", command=self.tree.yview)
        self.tree.configure(yscrollcommand=yscroll.set)

        self.tree.pack(side=LEFT, fill=BOTH, expand=True)
        yscroll.pack(side=RIGHT, fill=Y)

        self.tree.bind("<<TreeviewSelect>>", self.on_select)

        right = Frame(main, padx=10)
        right.pack(side=RIGHT, fill=Y)

        ttk.Label(right, text="DETAIL AKCE", style="Header.TLabel").pack(anchor="w")

        self.detail = Frame(right)
        self.detail.pack(fill=X, pady=(6, 0))
        self.detail.columnconfigure(1, weight=1)

        def make_row(r, text):
            ttk.Label(self.detail, text=text, style="Header.TLabel").grid(row=r, column=0, sticky="w", pady=2)

        make_row(0, "NAZEV AKCE")
        make_row(1, "DATUM")
        make_row(2, "MISTO AKCE")
        make_row(3, "POCET TECHNIKY")
        make_row(4, "POCET LIDI")
        make_row(5, "BUDGET")

        self.l_nazev = ttk.Label(self.detail, text="-")
        self.l_datum = ttk.Label(self.detail, text="-")
        self.l_misto = ttk.Label(self.detail, text="-")
        self.l_tech = ttk.Label(self.detail, text="-")
        self.l_lidi = ttk.Label(self.detail, text="-")
        self.l_budget = ttk.Label(self.detail, text="-")

        self.l_nazev.grid(row=0, column=1, sticky="w")
        self.l_datum.grid(row=1, column=1, sticky="w")
        self.l_misto.grid(row=2, column=1, sticky="w")
        self.l_tech.grid(row=3, column=1, sticky="w")
        self.l_lidi.grid(row=4, column=1, sticky="w")
        self.l_budget.grid(row=5, column=1, sticky="w")

        ttk.Label(right, text="Canvas bar (podle budgetu)", style="Header.TLabel").pack(anchor="w", pady=(12, 2))
        self.canvas = Canvas(right, width=260, height=24, bg="white", highlightthickness=1, highlightbackground="gray")
        self.canvas.pack()
        self.bar = self.canvas.create_rectangle(0, 0, 0, 24, fill="#4156a7", outline="")

        btns = Frame(right, pady=12)
        btns.pack(fill=X)

        ttk.Button(btns, text="EDITOVAT AKCI", command=self.edit_selected).pack(fill=X, pady=(0, 6))
        ttk.Button(btns, text="SMAZAT AKCI", command=self.delete_selected).pack(fill=X)

        self.last_label = ttk.Label(right, text="Poslední vybraná akce: -")
        self.last_label.pack(anchor="w", pady=(10, 0))

        # ================= bottom login =================
        bottom = Frame(root, padx=10, pady=6)
        bottom.pack(fill=X)
        ttk.Label(bottom, text=f"LOGIN: {LOGIN}", style="Header.TLabel").pack(side=RIGHT)

        self.refresh_table(self.data)

    # ---------------- Table ----------------
    def refresh_table(self, rows):
        for iid in self.tree.get_children():
            self.tree.delete(iid)

        self.current_rows = rows[:]

        for i, r in enumerate(rows):
            self.tree.insert(
                "", "end", iid=str(i),
                values=(r["nazev"], r["datum"], r["misto"], r["lidi"], f'{r["budget"]} Kč')
            )

        self.selected = None
        self.show_detail(None)

    def on_select(self, _e=None):
        sel = self.tree.selection()
        if not sel:
            return

        idx = int(sel[0])
        if idx < 0 or idx >= len(self.current_rows):
            return

        self.selected = self.current_rows[idx]
        self.show_detail(self.selected)

    def show_detail(self, r):
        if not r:
            self.l_nazev.config(text="-")
            self.l_datum.config(text="-")
            self.l_misto.config(text="-")
            self.l_tech.config(text="-")
            self.l_lidi.config(text="-")
            self.l_budget.config(text="-")
            self.last_label.config(text="Poslední vybraná akce: -")
            self.canvas.coords(self.bar, 0, 0, 0, 24)
            return

        self.l_nazev.config(text=r["nazev"])
        self.l_datum.config(text=r["datum"])
        self.l_misto.config(text=r["misto"])
        self.l_tech.config(text=str(r["technika"]))
        self.l_lidi.config(text=str(r["lidi"]))
        self.l_budget.config(text=f'{r["budget"]} Kč')

        self.last_label.config(text=f"Poslední vybraná akce: {r['nazev']}")
        self.update_budget_bar(r["budget"])

    def update_budget_bar(self, budget):
        max_budget = 100000
        w = int(max(0, min(260, (budget / max_budget) * 260)))
        self.canvas.coords(self.bar, 0, 0, w, 24)

    # ---------------- Filter ----------------
    def apply_filter(self):
        name = self.v_name.get().strip().lower()
        date = self.v_date.get().strip()
        place = self.v_place.get().strip().lower()

        rows = []
        for r in self.data:
            if name and name not in r["nazev"].lower():
                continue
            if date and date not in r["datum"]:
                continue
            if place and place not in r["misto"].lower():
                continue
            rows.append(r)

        self.refresh_table(rows)

    # ---------------- Add/Edit window (same form) ----------------
    def open_form_window(self, mode="add", item=None):
        w = Toplevel(self.root)
        w.resizable(False, False)
        w.transient(self.root)
        w.grab_set()

        if mode == "add":
            w.title("Přidat akci")
        else:
            w.title("Editovat akci")

        w.geometry("440x380")

        frm = Frame(w, padx=12, pady=12)
        frm.pack(fill=BOTH, expand=True)

        frm.columnconfigure(0, weight=1)
        frm.columnconfigure(1, weight=1)

        ttk.Label(frm, text="NAZEV AKCE", style="Header.TLabel").grid(row=0, column=0, sticky="w")
        e_name = ttk.Entry(frm)
        e_name.grid(row=1, column=0, columnspan=2, sticky="we", pady=(0, 8))

        ttk.Label(frm, text="DATUM (např. 20.5.2026)", style="Header.TLabel").grid(row=2, column=0, sticky="w")
        e_date = ttk.Entry(frm)
        e_date.grid(row=3, column=0, columnspan=2, sticky="we", pady=(0, 8))

        ttk.Label(frm, text="MISTO KONANI", style="Header.TLabel").grid(row=4, column=0, sticky="w")
        e_place = ttk.Entry(frm)
        e_place.grid(row=5, column=0, columnspan=2, sticky="we", pady=(0, 8))

        ttk.Label(frm, text="POCET TECHNIKY", style="Header.TLabel").grid(row=6, column=0, sticky="w")
        e_tech = ttk.Entry(frm)
        e_tech.grid(row=7, column=0, sticky="we", pady=(0, 8))

        ttk.Label(frm, text="POCET LIDI", style="Header.TLabel").grid(row=6, column=1, sticky="w")
        e_people = ttk.Entry(frm)
        e_people.grid(row=7, column=1, sticky="we", pady=(0, 8))

        ttk.Label(frm, text="BUDGET", style="Header.TLabel").grid(row=8, column=0, sticky="w")
        e_budget = ttk.Entry(frm)
        e_budget.grid(row=9, column=0, columnspan=2, sticky="we", pady=(0, 12))

        ttk.Label(frm, text=f"LOGIN: {LOGIN}", style="Header.TLabel").grid(row=12, column=0, sticky="w", pady=(6, 0))

        if mode == "edit" and item:
            e_name.insert(0, item["nazev"])
            e_date.insert(0, item["datum"])
            e_place.insert(0, item["misto"])
            e_tech.insert(0, str(item["technika"]))
            e_people.insert(0, str(item["lidi"]))
            e_budget.insert(0, str(item["budget"]))

        def save():
            try:
                tech = int(e_tech.get().strip())
                people = int(e_people.get().strip())
                budget = int(e_budget.get().strip())
            except ValueError:
                messagebox.showerror("Chyba", "Technika, lidi a budget musí být číslo.")
                return

            if mode == "add":
                r = {
                    "nazev": e_name.get().strip() or "bez nazvu",
                    "datum": e_date.get().strip() or "-",
                    "misto": e_place.get().strip() or "-",
                    "technika": tech,
                    "lidi": people,
                    "budget": budget
                }
                self.data.append(r)
            else:
                item["nazev"] = e_name.get().strip() or item["nazev"]
                item["datum"] = e_date.get().strip() or item["datum"]
                item["misto"] = e_place.get().strip() or item["misto"]
                item["technika"] = tech
                item["lidi"] = people
                item["budget"] = budget

            self.refresh_table(self.data)
            w.destroy()

        ttk.Button(frm, text=("PRIDAT AKCI" if mode == "add" else "ULOZIT ZMENY"), command=save).grid(row=11, column=0, sticky="we")
        ttk.Button(frm, text="<--- ZPET", command=w.destroy).grid(row=11, column=1, sticky="we", padx=(8, 0))

    def edit_selected(self):
        if not self.selected:
            messagebox.showinfo("Info", "Vyber akci v tabulce.")
            return
        self.open_form_window(mode="edit", item=self.selected)

    def delete_selected(self):
        if not self.selected:
            messagebox.showinfo("Info", "Vyber akci v tabulce.")
            return
        if messagebox.askyesno("Smazat", f"Smazat akci {self.selected['nazev']}?"):
            self.data.remove(self.selected)
            self.selected = None
            self.refresh_table(self.data)


if __name__ == "__main__":
    root = Tk()
    root.configure(bg="#7b3636")
    App(root)
    root.mainloop()
