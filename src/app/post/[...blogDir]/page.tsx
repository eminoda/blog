// import Image from "next/image";

export default function Post({ params }: { params: { blogDir: string } }) {
  return <h1>文s章 {params.blogDir}</h1>;
}
