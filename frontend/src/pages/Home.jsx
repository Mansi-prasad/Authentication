import React from 'react'
import Header from '../components/Header'

const Home = () => {
  return (
    <>
    <Header />
    <main className="min-h-screen px-4 py-10 ">
        <h1 className="text-3xl font-bold">
          Welcome to Home Page!
        </h1>

        <p className="mt-4">
          Your email has been successfully verified.
        </p>
      </main>
    </>
  )
}

export default Home