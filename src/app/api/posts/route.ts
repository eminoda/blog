import { NextResponse } from "next/server";
import moment from "moment";
import OssClient from "@/libs/oss";

export async function GET(request: Request) {
  const client = new OssClient();
  try {
    const { objects, nextMarker } = await client.list(
      {
        delimiter: "",
        prefix: "draft",
        "max-keys": 100,
      },
      { timeout: 10 * 1000 }
    );
    return NextResponse.json({
      code: 0,
      data: {
        list: objects
          .map((item) => item.name)
          .filter((item) => item.indexOf("index.md") !== -1)
          .map((item) => item.split("/index.md")[0]),
        nextMarker,
      },
    });
  } catch (error) {
    return NextResponse.json({ code: -1 });
  }
}
