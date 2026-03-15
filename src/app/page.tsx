export default function Home() {
  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-6">

      <h1 className="text-4xl font-bold">
        Dharmaya
      </h1>

      <p className="text-lg text-gray-600">
        Simple Dharma Guidance in Hindi
      </p>

      <a
        href="/chat"
        className="bg-black text-white px-6 py-3 rounded-lg"
      >
        Ask a Question
      </a>

    </main>
  )
}