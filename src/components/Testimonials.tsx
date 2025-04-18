import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";

export function Testimonials() {
  return (
    <>
      <Separator className="my-8" />
      <section className="py-20 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <h2 className="text-3xl font-bold text-center mb-12 text-black dark:text-white">
          What Students Say
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-black dark:text-white">
                    John Doe
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    High School Student
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Aivise helped me understand my math mistakes better than my
                teacher ever could!"
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>AS</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-black dark:text-white">
                    Alice Smith
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    College Student
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "The AI explanations are so clear and helpful. It's like having
                a personal tutor!"
              </p>
            </CardContent>
          </Card>
          <Card className="dark:bg-gray-800">
            <CardContent className="pt-6">
              <div className="flex items-center gap-4 mb-4">
                <Avatar>
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>RB</AvatarFallback>
                </Avatar>
                <div>
                  <p className="font-semibold text-black dark:text-white">
                    Robert Brown
                  </p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">
                    University Student
                  </p>
                </div>
              </div>
              <p className="text-gray-600 dark:text-gray-300">
                "Finally, a tool that actually helps me learn from my mistakes
                instead of just pointing them out."
              </p>
            </CardContent>
          </Card>
        </div>
      </section>
    </>
  );
}
