import { HashRouter as Router, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import { useMobileStore } from "./store/mobileStore";
import { useMobileTouchOptimization } from "./utils/mobileOptimization";
import Home from "@/pages/Home";
import { LearningPage } from "./components/mobile/LearningPage";

export default function App() {
  const initializeStore = useMobileStore((state) => state.initializeStore);
  
  // 应用移动端优化
  useMobileTouchOptimization();

  useEffect(() => {
    initializeStore();
  }, [initializeStore]);

  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/learn" element={<LearningPage />} />
        <Route path="/other" element={<div className="text-center text-xl">Other Page - Coming Soon</div>} />
      </Routes>
    </Router>
  );
}
