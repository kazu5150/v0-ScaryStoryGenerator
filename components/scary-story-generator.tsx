"use client"

import { useState } from 'react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Skull, Ghost } from 'lucide-react'

export function ScaryStoryGeneratorComponent() {
  const [theme, setTheme] = useState('')
  const [story, setStory] = useState('')
  const [isLoading, setIsLoading] = useState(false)

  const generateStory = async () => {
    setIsLoading(true)
    try {
      const response = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_OPENAI_API_KEY}` // ここを変更
        },
        body: JSON.stringify({
          model: "gpt-3.5-turbo",
          messages: [
            {
              role: "system",
              content: "あなたは怖い話を生成するAIです。与えられたテーマに基づいて、短くて怖い話を作成してください。"
            },
            {
              role: "user",
              content: `テーマ: ${theme}`
            }
          ],
          max_tokens: 300
        })
      })

      const data = await response.json()
      setStory(data.choices[0].message.content)
    } catch (error) {
      console.error('Error:', error)
      setStory('エラーが発生しました。もう一度お試しください。')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <Card className="w-full max-w-md bg-gray-900 text-red-500 border-red-800 shadow-lg shadow-red-900/50">
        <CardHeader className="border-b border-red-800">
          <CardTitle className="text-2xl font-bold flex items-center">
            <Skull className="mr-2" />
            怖い話ジェネレーター
          </CardTitle>
          <CardDescription className="text-gray-400">テーマを入力して、AIが怖い話を生成します。</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 mt-4">
          <div className="relative">
            <Input
              type="text"
              placeholder="テーマを入力してください"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              className="bg-gray-800 border-red-800 text-white placeholder-gray-500 focus:ring-red-500 focus:border-red-500"
            />
            <Ghost className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500" />
          </div>
          <Button 
            onClick={generateStory} 
            disabled={isLoading || !theme}
            className="w-full bg-red-700 hover:bg-red-600 text-white"
          >
            {isLoading ? '生成中...' : '怖い話を生成'}
          </Button>
        </CardContent>
        {story && (
          <div className="mt-4 p-4 bg-gray-800 rounded-md mx-4 mb-4 border border-red-800">
            <h3 className="font-bold mb-2 text-red-400">生成された怖い話：</h3>
            <p className="text-gray-300 font-medium leading-relaxed">{story}</p>
          </div>
        )}
        <CardFooter className="border-t border-red-800">
          <p className="text-sm text-gray-500">警告：生成された内容には過激な表現が含まれる可能性があります。</p>
        </CardFooter>
      </Card>
    </div>
  )
}