import { useEffect } from "react";

const App = () => {
  useEffect(() => { 
    async function callAPI() { 
      const res = await fetch(import.meta.env.VITE_API_URL);
      const data = await res.json();
      console.log("API called", data);
    }
    callAPI();
  },[])
  return (
    <div className="bg-amber-100 text-black">Hello</div>
  );
}

export default App;