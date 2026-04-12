from sqlalchemy import create_engine, Integer, String, Select, ForeignKey

from sqlalchemy.orm import DeclarativeBase, Mapped, MappedColumn, Session, Relationship

engine = create_engine('sqlite:///testdb.db', echo = True)

# Base dědí z DeclarativeBase
class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = MappedColumn(Integer, primary_key = True)
    name: Mapped[str] = MappedColumn(String(50))
    email: Mapped[str] = MappedColumn(String(100), nullable = True)

    posts: Mapped[list["Post"]] = Relationship(back_populates = 'author')

    def __repr__(self):
        return f'User(id = {self.id}, name = {self.name}, email = {self.email})'


class Post(Base):
    __tablename__ = 'posts'

    id: Mapped[int] = MappedColumn(Integer, primary_key = True)
    title: Mapped[str] = MappedColumn(String(100))
    content: Mapped[str] = MappedColumn(String(100), nullable = True)

    user_id: Mapped[int] = MappedColumn(ForeignKey('users.id'))

    author: Mapped["User"] = Relationship(back_populates = 'posts')

    def __repr__(self):
        return f'Post: {self.id}, title: {self.title}, content: {self.content}'



Base.metadata.create_all(engine)


#Insert
with Session(engine) as session:
    user1 = User(name = 'Aleš', email = 'anajser@gmail.com')
    user2 = User(name = 'Petr', email = 'Petr@pavel.cz')

    session.add(user1)
    session.add(user2)

    session.commit()


#Select
with Session(engine) as session:
    result = session.execute(statement= Select(User)).scalars().all()

    for user in result:
        print(user)


#Update
with Session(engine) as session:
    stmt = Select(User).where(User.email == 'anajser@gmail.com')
    user = session.execute(stmt).scalar_one()

    #user.name = "Neco lol"
    session.commit

    result = session.execute(statement= Select(User)).scalars().all()

    for user in result:
        print(user)

#Delete
"""
with Session(engine) as session:
    Staci najít usera a pak jenom dát:
    
    session.delete(user)

"""


with Session(engine) as session:
    posts = [
        Post(title = 'Titul 1', content = 'slkasdlkadlskds'),
        Post(title = 'Titulek 2', content = 'fjafklsafjafjalk')
    ]
    
    stmt = Select(User).where(User.email == 'anajser@gmail.com')
    user = session.execute(stmt).scalar_one()

    user.posts = posts
    session.commit

    result = session.execute(statement= Select(User)).scalars().all()

    for user in result:
        print(user)




