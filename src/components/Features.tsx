import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export function Features() {
  return (
    <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <Card className="border-[#ff8a33]/20 dark:bg-gray-800">
        <CardHeader>
          <a href="/upload" className="block">
          <CardTitle className="text-center text-black dark:text-white">
            📝 Upload Assignments
          </CardTitle>
          </a>
        </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Easily upload your graded work and let our AI analyze your
              mistakes.
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#ff8a33]/20 dark:bg-gray-800">
          <CardHeader>
            <CardTitle className="text-center text-black dark:text-white">
              🤖 Ask AI
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Get instant, personalized explanations for your errors and
              misunderstandings.
            </p>
          </CardContent>
        </Card>
        <Card className="border-[#ff8a33]/20 dark:bg-gray-800">
          <CardHeader>
          <a href="/roadmap" className="block">
          <CardTitle className="text-center text-black dark:text-white">
           💡 Get Personalized Roadmaps
          </CardTitle>
          </a>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Receive clear and enhanced roadmaps and schedules to manage your time effectively and overcome procastination.
            </p>
          </CardContent>
        </Card>
      </div>
    </section>
  );
}
