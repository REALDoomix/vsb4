# -*- coding: utf-8 -*-

from tkinter import *
from math import sqrt
import tkinter.font

class myApp:
    # Task reference: LMS, cv2
    def prevod(self, event=None):
        v = float(self.ent_in.get())
        print(self.dir.get())
        self.ent_out.delete(0, END)
        self.ent_out.insert(0, str(round(v, 2)))

    def __init__(self, window):

        window.title('PĹ™evodnĂ­k teplot') # popisek okna
        window.resizable(False, False) # povoleni zmeny velikosti okna
        window.bind('<Return>', self.prevod) # mapovani udalosti (Enter)
        
        def_font = tkinter.font.nametofont("TkDefaultFont")
        def_font.config(size=16) # zmena defaultniho fontu

        self.left_frame = Frame(window) # nebo LabelFrame s napisem
        self.right_frame = Frame(window)
        
        self.dir = IntVar()
        self.dir.set(1) 
        
        self.ent_frame = Frame(self.left_frame)
        self.lbl_in = Label(self.ent_frame, text="Vstup")
        self.ent_in = Entry(self.ent_frame, width=10, font = def_font)
        self.ent_in.insert(0, '0')

        self.ca = Canvas(self.right_frame, width=300, height=400)
        self.photo = PhotoImage(file='th_empty.png')
        self.ca.create_image(150, 200, image=self.photo)
        # Vychozi souradnice pro obdelnik k teplomeru: 146, 292, 152, 230

        self.left_frame.pack(side="left", fill=Y)
        self.right_frame.pack(side="right")
        self.ent_frame.pack()
        
        self.lbl_in.grid(row=1, column=1)  
        self.ent_in.grid(row=2, column=1, padx=20)

        self.ent_in.focus_force()

root = Tk()
app = myApp(root)
root.mainloop()