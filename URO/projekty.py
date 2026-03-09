from tkinter import *
from tkinter import ttk

class myApp:
    def __init__(self, window): 
        tree = ttk.Treeview(window,columns=('eventName',
                            'eventDate',
                            'eventTag'),show='tree headings')
        


        tree.heading('eventName', text='Jméno události')
        tree.heading('eventDate', text='Datum události')
        tree.heading('eventTag', text='Tag události')

        tree.insert('', END, values=('Pondělí BRUH','67.67.2067','Důležité skipovat'))


        #tree.insert()


window = Tk()
app = myApp(window)
window.mainloop()