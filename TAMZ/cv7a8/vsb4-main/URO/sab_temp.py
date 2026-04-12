# -*- coding: utf-8 -*-
from tkinter import *
import tkinter.font
import tkinter.messagebox

class myApp:
    def prevod(self, event=None):
        try:
            vstup = float(self.ent_in.get())
            smer = self.dir.get()
            
            if smer == 1: # c na f
                vysledek = vstup * 9/5 + 32
                celsia = vstup
            else: # f na c
                vysledek = (vstup - 32) * 5/9
                celsia = vysledek
            
            # vystup
            self.ent_out.config(state='normal')
            self.ent_out.delete(0, END)
            self.ent_out.insert(0, f"{round(vysledek, 2)}")
            self.ent_out.config(state='readonly')

            self.render_teplomer(celsia)
            
        except ValueError:
            tkinter.messagebox.showerror("Chybný vstup", "Zadejte prosím ČÍSLO")

    def render_teplomer(self, stupne_c):
        self.ca.delete('rtut')
        
        nula_y = 231
        pixelu_na_stupen = 3
        
        y_top = nula_y - (stupne_c * pixelu_na_stupen)
        
        self.ca.create_rectangle(146, y_top, 154, nula_y, fill="blue", outline="", tag='rtut')

    def __init__(self, root):
        root.title('Převodník teplot')
        root.resizable(False, False)
        
        def_font = tkinter.font.nametofont("TkDefaultFont")
        def_font.config(size=12)


        self.dir = IntVar(value=1)


        self.left_frame = Frame(root, padx=10, pady=10, relief='solid', borderwidth=2)
        self.left_frame.pack(side="left", fill=Y)


        self.dir_frame = LabelFrame(self.left_frame, text="Směr")
        self.dir_frame.pack(fill=X, pady=5)
        Radiobutton(self.dir_frame, text="C -> F", variable=self.dir, value=1).pack(side=LEFT)
        Radiobutton(self.dir_frame, text="F -> C", variable=self.dir, value=2).pack(side=LEFT)

        self.ent_frame = Frame(self.left_frame, relief='sunken', borderwidth=2)
        self.ent_frame.pack(pady=10)

        Label(self.ent_frame, text="Vstup").grid(row=0, column=0)
        self.ent_in = Entry(self.ent_frame, width=10)
        self.ent_in.grid(row=1, column=0)
        self.ent_in.insert(0, '10')

        Label(self.ent_frame, text="Výstup").grid(row=2, column=0)
        self.ent_out = Entry(self.ent_frame, width=10)
        self.ent_out.grid(row=3, column=0)

        self.btn_conv = Button(self.left_frame, text="Convert", command=self.prevod)
        self.btn_conv.pack(pady=10)

        # login
        Label(self.left_frame, text="Aleš Najser\nNAJ0062", fg="gray").pack(side=BOTTOM)

        self.right_frame = Frame(root,relief='solid',borderwidth=2)
        self.right_frame.pack(side="right")
        
        self.ca = Canvas(self.right_frame, width=300, height=400, bg="white")
        self.ca.pack()
        
        #teploměr
        try:
            self.photo = PhotoImage(file="th_empty.png")
            self.ca.create_image(150, 200, image=self.photo)
        except:
            self.ca.create_text(150, 200, text="teploměr nenalezen :(")


        root.bind('<Return>', self.prevod)
        
        self.prevod()

if __name__ == "__main__":
    root = Tk()
    app = myApp(root)
    root.mainloop()