'use client'

import { useEffect, useState } from 'react'
import { client } from '@/lib/api-client'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'

// 确保cn函数可用
import { cn } from '@/lib/utils'
import { toast } from 'sonner'

type Student = {
  id: number
  name: string
  age: number
}

export default function Home() {
  const [message, setMessage] = useState('')
  const [students, setStudents] = useState<Student[]>([])
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [editingId, setEditingId] = useState<number | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false)
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [isDetailDialogOpen, setIsDetailDialogOpen] = useState(false)

  // 获取数据
  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        // 获取欢迎信息
        const helloData = await (await (client as any).api.hello.$get()).json()
        setMessage(helloData.message)
        
        // 获取学生数据
        const studentsData = await (await (client as any).api.students.$get()).json()
        setStudents(studentsData)
      } catch (error) {
        console.error('获取数据失败:', error)
        toast.error('获取数据失败，请刷新页面重试')
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchData()
  }, [])

  // 添加学生
  const handleAddStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      const newStudent = await (await (client as any).api.students.$post({
        json: {
          name,
          age: parseInt(age)
        }
      })).json()
      
      setStudents([...students, newStudent])
      setName('')
      setAge('')
      setIsAddDialogOpen(false)
      toast.success('学生添加成功')
    } catch (error) {
      console.error('添加学生失败:', error)
      toast.error('添加学生失败，请重试')
    }
  }

  // 删除学生
  const handleDeleteStudent = async (id: number) => {
    try {
      await (await (client as any).api.students[':id'].$delete({
        param: {
          id: id.toString()
        }
      })).json()
      
      setStudents(students.filter(student => student.id !== id))
      if (selectedStudent?.id === id) {
        setSelectedStudent(null)
      }
      toast.success('学生删除成功')
    } catch (error) {
      console.error('删除学生失败:', error)
      toast.error('删除学生失败，请重试')
    }
  }

  // 开始编辑学生
  const handleEditStudent = (student: Student) => {
    setName(student.name)
    setAge(student.age.toString())
    setEditingId(student.id)
    setIsEditDialogOpen(true)
  }

  // 更新学生
  const handleUpdateStudent = async (e: React.FormEvent) => {
    e.preventDefault()
    if (editingId === null) return
    
    try {
      const updatedStudent = await (await (client as any).api.students[':id'].$put({
        param: {
          id: editingId.toString()
        },
        json: {
          name,
          age: parseInt(age)
        }
      })).json()
      
      setStudents(students.map(student => 
        student.id === editingId ? updatedStudent : student
      ))
      
      setName('')
      setAge('')
      setEditingId(null)
      setIsEditDialogOpen(false)
      toast.success('学生信息更新成功')
    } catch (error) {
      console.error('更新学生失败:', error)
      toast.error('更新学生失败，请重试')
    }
  }

  // 查看学生详情
  const handleViewStudent = async (id: number) => {
    try {
      const student = await (await (client as any).api.students[':id'].$get({
        param: {
          id: id.toString()
        }
      })).json()
      
      setSelectedStudent(student)
      setIsDetailDialogOpen(true)
    } catch (error) {
      console.error('获取学生详情失败:', error)
      toast.error('获取学生详情失败，请重试')
    }
  }

  // 打开添加学生对话框
  const openAddDialog = () => {
    setName('')
    setAge('')
    setIsAddDialogOpen(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 py-8 px-4">
      <div className="max-w-6xl mx-auto">
        {/* 页面标题 */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white tracking-tight">学生管理系统</h1>
          {message ? (
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">{message}</p>
          ) : (
            <p className="mt-2 text-xl text-gray-600 dark:text-gray-300">加载中...</p>
          )}
        </div>

        {/* 主要内容 */}
        <Card className="mb-8 overflow-hidden border-0 shadow-lg">
          <CardHeader className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white p-6">
            <CardTitle className="text-2xl">学生管理</CardTitle>
            <CardDescription className="text-blue-50">管理和维护学生信息</CardDescription>
          </CardHeader>
          <CardContent className="p-0">
            {/* 学生列表表格 */}
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">学生列表</h2>
                <Button
                  onClick={openAddDialog}
                  className="bg-green-500 hover:bg-green-600 text-white"
                >
                  添加学生
                </Button>
              </div>
              
              {isLoading ? (
                <div className="flex justify-center items-center py-12">
                  <p className="text-gray-500 dark:text-gray-400">加载中...</p>
                </div>
              ) : students.length === 0 ? (
                <div className="flex flex-col items-center justify-center py-12 text-center">
                  <p className="text-gray-500 dark:text-gray-400 text-lg mb-4">暂无学生数据</p>
                  <Button onClick={openAddDialog} className="bg-blue-500 hover:bg-blue-600 text-white">
                    添加第一个学生
                  </Button>
                </div>
              ) : (
                <div className="rounded-lg border overflow-hidden">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50 dark:bg-gray-800">
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300">ID</TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300">姓名</TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300">年龄</TableHead>
                        <TableHead className="font-medium text-gray-700 dark:text-gray-300">操作</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {students.map(student => (
                        <TableRow 
                          key={student.id} 
                          className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer"
                        >
                          <TableCell className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                            {student.id}
                          </TableCell>
                          <TableCell className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                            {student.name}
                          </TableCell>
                          <TableCell className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                            {student.age}
                          </TableCell>
                          <TableCell className="py-3 px-4 border-b border-gray-200 dark:border-gray-700">
                            <div className="flex gap-2">
                              <Button
                                size="sm"
                                className="bg-blue-500 hover:bg-blue-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleViewStudent(student.id);
                                }}
                              >
                                查看
                              </Button>
                              <Button
                                size="sm"
                                className="bg-amber-500 hover:bg-amber-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleEditStudent(student);
                                }}
                              >
                                编辑
                              </Button>
                              <Button
                                size="sm"
                                className="bg-red-500 hover:bg-red-600 text-white"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteStudent(student.id);
                                }}
                              >
                                删除
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* 添加学生对话框 */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              添加新学生
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
              请输入学生的基本信息
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddStudent} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="add-name" className="text-gray-700 dark:text-gray-300">
                姓名
              </Label>
              <Input
                id="add-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="请输入学生姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="add-age" className="text-gray-700 dark:text-gray-300">
                年龄
              </Label>
              <Input
                id="add-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="请输入学生年龄"
                min="1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                onClick={() => setIsAddDialogOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                添加学生
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 编辑学生对话框 */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              编辑学生信息
            </DialogTitle>
            <DialogDescription className="text-center text-gray-600 dark:text-gray-400">
              更新学生的基本信息
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleUpdateStudent} className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="edit-name" className="text-gray-700 dark:text-gray-300">
                姓名
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="请输入学生姓名"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-age" className="text-gray-700 dark:text-gray-300">
                年龄
              </Label>
              <Input
                id="edit-age"
                type="number"
                value={age}
                onChange={(e) => setAge(e.target.value)}
                required
                className="bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-700 focus:ring-2 focus:ring-blue-500"
                placeholder="请输入学生年龄"
                min="1"
              />
            </div>
            <DialogFooter className="pt-2">
              <Button
                type="button"
                onClick={() => setIsEditDialogOpen(false)}
                className="bg-gray-200 hover:bg-gray-300 text-gray-800 dark:bg-gray-700 dark:hover:bg-gray-600 dark:text-gray-200"
              >
                取消
              </Button>
              <Button
                type="submit"
                className="bg-amber-500 hover:bg-amber-600 text-white"
              >
                更新学生
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* 学生详情对话框 */}
      <Dialog open={isDetailDialogOpen} onOpenChange={setIsDetailDialogOpen}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-2xl font-bold text-center text-gray-900 dark:text-white">
              学生详情
            </DialogTitle>
          </DialogHeader>
          {selectedStudent && (
            <div className="space-y-4 py-4">
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-3">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">学生ID:</span>
                  <span className="text-gray-900 dark:text-white">{selectedStudent.id}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">姓名:</span>
                  <span className="text-gray-900 dark:text-white">{selectedStudent.name}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-700 dark:text-gray-300">年龄:</span>
                  <span className="text-gray-900 dark:text-white">{selectedStudent.age}</span>
                </div>
              </div>
              <DialogFooter className="pt-2">
                <Button
                  onClick={() => setIsDetailDialogOpen(false)}
                  className="bg-blue-500 hover:bg-blue-600 text-white"
                >
                  关闭
                </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
