from sqlalchemy import Integer, String, ForeignKey

from sqlalchemy.orm import DeclarativeBase, Mapped, MappedColumn, Relationship

from database import engine


# Base dědí z DeclarativeBase
class Base(DeclarativeBase):
    pass

class User(Base):
    __tablename__ = 'users'

    id: Mapped[int] = MappedColumn(Integer, primary_key = True)
    name: Mapped[str] = MappedColumn(String(50))
    email: Mapped[str] = MappedColumn(String(100), nullable = True)

    age: Mapped[int|None] = MappedColumn(Integer, nullable = True)

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