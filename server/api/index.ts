import { Hono } from 'hono'
import { PrismaClient } from '../../generated/prisma/client'

const app = new Hono().basePath('/api')

// 示例路由
app.get('/hello', (c) => {
  return c.json({ message: 'Hello from Hono API!' })
})

// 获取学生数据路由
app.get('/students', async (c) => {
  try {
    const prisma = new PrismaClient()
    const students = await prisma.student.findMany()
    return c.json(students)
  } catch (error) {
    console.error('Error fetching students:', error)
    return c.json({ error: 'Failed to fetch students' }, 500)
  }
})

// 删除学生
app.delete('/students/:id', async (c) => {
  try {
    const prisma = new PrismaClient()
    const id = Number(c.req.param('id'))
    await prisma.student.delete({
      where: {
        id: id,
      },
    })
    return c.json({ message: 'Student deleted successfully' })
  } catch (error) {
    console.error('Error deleting student:', error)
    return c.json({ error: 'Failed to delete student' }, 500)
  }
})

// 添加学生
app.post('/students', async (c) => {
  try {
    const prisma = new PrismaClient()
    const { name, age } = await c.req.json()
    const student = await prisma.student.create({
      data: {
        name,
        age,
      },
    })
    return c.json(student)
  } catch (error) {
    console.error('Error adding student:', error)
    return c.json({ error: 'Failed to add student' }, 500)
  }
})

// 更新学生
app.put('/students/:id', async (c) => {
  try {
    const prisma = new PrismaClient()
    const id = Number(c.req.param('id'))
    const { name, age } = await c.req.json()
    const student = await prisma.student.update({
      where: {
        id: id,
      },
      data: {
        name,
        age,
      },
    })
    return c.json(student)
  } catch (error) {
    console.error('Error updating student:', error)
    return c.json({ error: 'Failed to update student' }, 500)
  }
})

//查找学生
app.get('/students/:id', async (c) => {
  try {
    const prisma = new PrismaClient()
    const id = Number(c.req.param('id'))
    const student = await prisma.student.findUnique({
      where: {
        id: id,
      },
    })
    if (student) {
      return c.json(student)
    } else {
      return c.json({ error: 'Student not found' }, 404)
    }
  } catch (error) {
    console.error('Error fetching student:', error)
    return c.json({ error: 'Failed to fetch student' }, 500)
  }
})

// 错误处理
app.onError((err, c) => {
  console.error(`${err}`)
  return c.json({ error: 'Internal Server Error' }, 500)
})

export default app

export type AppType = typeof app