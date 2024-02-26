import jijoLogo from '../assets/jijo.png';

function App() {
  return (
    <div className="flex flex-col items-stretch h-full">
      <div className="h-16 bg-violet-500 flex">
        <img alt="logo" src={jijoLogo} className="w-16 h-16" />
      </div>
      <div className="grow p-4">
        <button className="p-3 bg-neutral-300 rounded-full">Link Google Sheets</button>
      </div>
    </div>
  )
}

export default App;
