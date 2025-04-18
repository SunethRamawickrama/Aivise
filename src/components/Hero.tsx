import { Button } from "@/components/ui/button";

export function Hero() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="text-center space-y-8">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold text-black dark:text-white">
          Understand Your Mistakes. Learn Smarter.
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
          Upload graded work and ask AI to explain what went wrong — Aivise
          gives personalized, clear feedback to help you improve.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button className="bg-[#ff8a33] hover:bg-[#ff8a33]/90 text-white">
            Try It Free
          </Button>
          <Button
            variant="outline"
            className="border-[#ff8a33] text-[#ff8a33] hover:bg-[#ff8a33]/10 dark:text-[#ff8a33] dark:border-[#ff8a33]"
          >
            See How It Works
          </Button>
        </div>
      </div>
    </section>
  );
}
