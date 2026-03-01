from tkinter import *
from tkinter import ttk

class myApp:
    # Task reference: https://www.blog.pythonlibrary.org/wp-content/uploads/2010/05/enterbox.png
    # Use pack()
    # On window resize
    # - all elements (widgets) stays in the center of their container
    # - entry widget fills the whole row
    # - buttons stays in the center (vertical & horizontal) of their containers
    # - use some padding

    # possible solution:
    def __init__(self, window): 
        self.label = ttk.Label(text="What is your favorite ice cream flavor?")
        self.label.pack(pady=20)

        self.entry = ttk.Entry()
        self.entry.pack(fill=X,padx=10,side=TOP)

        self.bu = ttk.Button(window, text="OK")
        self.bu.pack(side=LEFT,expand=True,padx=50,pady=50,ipadx=10,ipady=10)
        
        self.bu2 = ttk.Button(window, text="Cancel", command=window.destroy)
        self.bu2.pack(side=RIGHT,expand=True,padx=50,pady=50,ipadx=10,ipady=10)

window = Tk()
app = myApp(window)
window.mainloop()