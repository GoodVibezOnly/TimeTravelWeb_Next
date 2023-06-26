import Image from "next/image";
import FileUploader from "../components/FileUploader";
import BottomBar from "@/components/BottomBar";
import TopNavigationBar from "@/components/TopNaviationBar";

export default function Home() {
  return (
    <main>
      <TopNavigationBar></TopNavigationBar>
      <FileUploader />
      <BottomBar version="0.1.0" />
    </main>
  );
}
