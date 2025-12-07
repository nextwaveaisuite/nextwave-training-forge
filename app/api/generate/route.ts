import { NextResponse } from "next/server";

export async function POST(req: Request) {
  const body = await req.json();

  return NextResponse.json({
    success: true,
    course: {
      title: body?.title ?? "Sample Course",
      modules: [
        {
          title: "Introduction",
          lessons: ["Overview", "Goals", "Next Steps"]
        }
      ]
    }
  });
}
