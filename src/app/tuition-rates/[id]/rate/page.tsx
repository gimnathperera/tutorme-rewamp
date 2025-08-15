"use client";

import { useParams } from "next/navigation";
import { useFetchTuitionRatesQuery } from "@/store/api/splits/tuition-rates";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { TuitionRateItem } from "@/types/response-types";

const RatePage = () => {
  const params = useParams();
  const { levelId } = params;

  const { data:rate, isLoading } = useFetchTuitionRatesQuery({});

  if (isLoading) return <p>Loading tuition rates...</p>;
  if (!rate?.results || rate.results.length === 0) return <p>No tuition rates found.</p>;

  // Filter items for the selected level safely
  const levelItems: TuitionRateItem[] = rate.results.filter(
    (item) => item.level?.id === levelId
  );
  if (levelItems.length === 0) return <p>No tuition rates found for this level.</p>;

  // Get the level title from the filtered items
  const levelTitle = levelItems[0]?.level?.title || "Level";

  // Group subjects by grade
  const gradesMap: Record<string, TuitionRateItem[]> = {};
  levelItems.forEach((item) => {
    const gradeTitle = item.grade?.title || "Unknown Grade";
    if (!gradesMap[gradeTitle]) gradesMap[gradeTitle] = [];
    gradesMap[gradeTitle].push(item);
  });

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold text-center mb-2">{levelTitle}</h2>
      <h3 className="text-xl text-center mb-8 opacity-60">
        Explore the tuition rates for each subject by grade
      </h3>

      {Object.entries(gradesMap).map(([gradeTitle, subjects]) => (
        <div key={gradeTitle} className="mb-10">
          <h3 className="text-2xl font-semibold mb-4">{gradeTitle}</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {subjects.map((rate) => (
              <Card key={rate._id} className="bg-white">
                <CardContent>
                  <h4 className="text-lg font-semibold mb-2">
                    {rate.subject?.title || "Unknown Subject"}
                  </h4>
                  <p className="mb-1">
                    <strong>Full-Time:</strong>{" "}
                    {rate.fullTimeTuitionRate?.map((r) => `${r.minimumRate} - ${r.maximumRate} LKR`).join(", ") || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Part-Time:</strong>{" "}
                    {rate.partTimeTuitionRate?.map((r) => `${r.minimumRate} - ${r.maximumRate} LKR`).join(", ") || "N/A"}
                  </p>
                  <p className="mb-1">
                    <strong>Government:</strong>{" "}
                    {rate.govTuitionRate?.map((r) => `${r.minimumRate} - ${r.maximumRate} LKR`).join(", ") || "N/A"}
                  </p>
                </CardContent>
                <CardFooter>
                  <button className="w-full py-2 rounded-lg bg-primary-700 text-white hover:opacity-90">
                    Book {rate.subject?.title || "Class"} Class
                  </button>
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default RatePage;
