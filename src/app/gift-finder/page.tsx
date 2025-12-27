'use client'

import { useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import Header from '@/components/Header'
import ProductCard from '@/components/ProductCard'

interface QuizAnswer {
  question: string
  answer: string
}

interface Product {
  id: number
  title: string
  description: string
  base_price: number
  images: string[]
  category: {
    name: string
  } | null
}

const quizQuestions = [
  {
    id: 'relationship',
    question: 'Who is this gift for?',
    options: ['Family Member', 'Close Friend', 'Partner/Spouse', 'Colleague', 'Someone Special']
  },
  {
    id: 'age',
    question: 'What is their age group?',
    options: ['Under 18', '18-25', '26-35', '36-50', 'Over 50']
  },
  {
    id: 'occasion',
    question: 'What\'s the occasion?',
    options: ['Birthday', 'Anniversary', 'Thank You', 'Just Because', 'Holiday']
  },
  {
    id: 'budget',
    question: 'What\'s your budget range?',
    options: ['Under ₹500', '₹500-₹1000', '₹1000-₹2000', 'Over ₹2000']
  },
  {
    id: 'interests',
    question: 'What are their interests? (Select all that apply)',
    options: ['Art & Creativity', 'Sports & Fitness', 'Books & Reading', 'Cooking', 'Music', 'Travel', 'Home & Garden'],
    multiple: true
  }
]

export default function GiftFinder() {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [answers, setAnswers] = useState<QuizAnswer[]>([])
  const [selectedOptions, setSelectedOptions] = useState<string[]>([])
  const [recommendations, setRecommendations] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)

  const handleOptionSelect = (option: string) => {
    const question = quizQuestions[currentQuestion]
    if (question.multiple) {
      setSelectedOptions(prev =>
        prev.includes(option)
          ? prev.filter(o => o !== option)
          : [...prev, option]
      )
    } else {
      setSelectedOptions([option])
    }
  }

  const handleNext = async () => {
    if (selectedOptions.length === 0) return

    const newAnswer: QuizAnswer = {
      question: quizQuestions[currentQuestion].question,
      answer: quizQuestions[currentQuestion].multiple ? selectedOptions.join(', ') : selectedOptions[0]
    }

    const updatedAnswers = [...answers, newAnswer]
    setAnswers(updatedAnswers)
    setSelectedOptions([])

    if (currentQuestion < quizQuestions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
    } else {
      // Generate recommendations
      setLoading(true)
      await generateRecommendations(updatedAnswers)
      setLoading(false)
      setShowResults(true)
    }
  }

  const generateRecommendations = async (quizAnswers: QuizAnswer[]) => {
    try {
      // Build query parameters based on answers
      const params = new URLSearchParams()

      // Extract preferences from answers
      const relationship = quizAnswers.find(a => a.question.includes('Who is this gift for'))?.answer
      const age = quizAnswers.find(a => a.question.includes('age group'))?.answer
      const occasion = quizAnswers.find(a => a.question.includes('occasion'))?.answer
      const budget = quizAnswers.find(a => a.question.includes('budget'))?.answer
      const interests = quizAnswers.find(a => a.question.includes('interests'))?.answer?.split(', ')

      // Map budget to price range
      let minPrice = '', maxPrice = ''
      switch (budget) {
        case 'Under ₹500':
          maxPrice = '500'
          break
        case '₹500-₹1000':
          minPrice = '500'
          maxPrice = '1000'
          break
        case '₹1000-₹2000':
          minPrice = '1000'
          maxPrice = '2000'
          break
        case 'Over ₹2000':
          minPrice = '2000'
          break
      }

      // Map occasion to categories (simplified)
      let categoryFilter = ''
      switch (occasion) {
        case 'Birthday':
          categoryFilter = 'Birthday'
          break
        case 'Anniversary':
          categoryFilter = 'For Couples'
          break
      }

      // Build search query
      if (minPrice) params.append('minPrice', minPrice)
      if (maxPrice) params.append('maxPrice', maxPrice)
      if (categoryFilter) params.append('category', categoryFilter)

      // Add some randomization for variety
      params.append('limit', '6')
      params.append('sortBy', 'newest')

      const response = await fetch(`/api/products?${params.toString()}`)
      const data = await response.json()

      setRecommendations(data.products || [])
    } catch (error) {
      console.error('Error generating recommendations:', error)
      setRecommendations([])
    }
  }

  const resetQuiz = () => {
    setCurrentQuestion(0)
    setAnswers([])
    setSelectedOptions([])
    setRecommendations([])
    setShowResults(false)
  }

  if (showResults) {
    return (
      <div className="min-h-screen bg-off-white">
        <Header />

        <div className="pt-32 pb-16 px-4">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-12">
              <h1 className="text-4xl lg:text-5xl font-playfair text-navy mb-6">
                Perfect Gifts for Them! 🎁
              </h1>
              <p className="text-xl text-gray-600 font-playfair max-w-2xl mx-auto mb-8">
                {"Based on your answers, here are some personalized recommendations they'll love."}
              </p>
              <button
                onClick={resetQuiz}
                className="bg-deep-gold text-navy font-playfair font-semibold px-6 py-3 rounded-lg hover:bg-opacity-90 transition-colors"
              >
                Take Quiz Again
              </button>
            </div>

            {recommendations.length > 0 ? (
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
                {recommendations.map((product) => (
                  <ProductCard key={product.id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-lg text-gray-600 font-playfair mb-6">
                  {"We couldn't find perfect matches, but here are some popular gifts!"}
                </p>
                <Link
                  href="/products"
                  className="bg-navy text-white font-playfair font-semibold px-8 py-4 rounded-lg hover:bg-opacity-90 transition-colors"
                >
                  Browse All Gifts
                </Link>
              </div>
            )}

            <div className="text-center">
              <Link
                href="/"
                className="bg-white border-2 border-navy text-navy font-playfair font-semibold px-8 py-4 rounded-lg hover:bg-navy hover:text-white transition-colors"
              >
                Back to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const currentQ = quizQuestions[currentQuestion]

  return (
    <div className="min-h-screen bg-off-white">
      <Header />

      <div className="pt-32 pb-16 px-4">
        <div className="max-w-2xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-4xl lg:text-5xl font-playfair text-navy mb-6">
              Gifts That Mean More — Explore All
            </h1>
            <p className="text-xl text-gray-600 font-playfair">
              {"Answer a few questions and we'll recommend the perfect personalized gift."}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="mb-8">
            <div className="flex justify-between text-sm text-gray-600 font-playfair mb-2">
              <span>Question {currentQuestion + 1} of {quizQuestions.length}</span>
              <span>{Math.round(((currentQuestion + 1) / quizQuestions.length) * 100)}% Complete</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div
                className="bg-deep-gold h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
              ></div>
            </div>
          </div>

          {/* Question Card */}
          <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
            <h2 className="text-2xl font-playfair text-navy mb-6">
              {currentQ.question}
            </h2>

            <div className="space-y-3">
              {currentQ.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  className={`w-full text-left p-4 rounded-lg border-2 transition-all duration-200 font-playfair ${
                    selectedOptions.includes(option)
                      ? 'border-deep-gold bg-deep-gold/10 text-navy'
                      : 'border-gray-200 hover:border-deep-gold text-gray-700'
                  }`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>

          {/* Navigation */}
          <div className="flex justify-between">
            <button
              onClick={() => {
                if (currentQuestion > 0) {
                  setCurrentQuestion(currentQuestion - 1)
                  setSelectedOptions([])
                }
              }}
              disabled={currentQuestion === 0}
              className="bg-gray-200 text-gray-600 font-playfair font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300 transition-colors"
            >
              Previous
            </button>

            <button
              onClick={handleNext}
              disabled={selectedOptions.length === 0 || loading}
              className="bg-navy text-white font-playfair font-semibold px-6 py-3 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-opacity-90 transition-colors"
            >
              {loading ? 'Finding Gifts...' : currentQuestion === quizQuestions.length - 1 ? 'Get Recommendations' : 'Next'}
            </button>
          </div>

          {/* Skip to Browse */}
          <div className="text-center mt-8">
            <Link
              href="/products"
              className="text-gray-600 font-playfair hover:text-navy transition-colors"
            >
              Skip quiz and browse all gifts →
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
