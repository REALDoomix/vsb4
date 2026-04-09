from database import engine

from models import User,Post

from sqlalchemy import select

from sqlalchemy.orm import Session

with Session(engine) as session:
    u1 = User(name = 'Lala', email = 'lala@lulu.com', age = 67)
    u2 = User(name= 'Tralalero', email = 'tralalero@tralala.com')

    session.add_all([u1,u2])

    session.commit()

    post = Post(title =  'Ballerina cappucino', content =  'O NOOOO', author = u1)

    session.add(post)

    session.commit()


# Select *

with Session(engine) as session:
    stmt = select(User)
    users = session.execute(stmt).scalars().all()

    for user in users:
        print(user)

