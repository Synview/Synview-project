 
import Form from "./RegisterForm.tsx";
export default function FormSection() {
  return (
    <div className="h-screen bg-neutral-900 bg-[url(./public/formbg.svg)] bg-no-repeat">
      <div className="flex justify-evenly  ">
        <p className="m-44 text-6xl w-96 text-start"><b>Follow Every Commit, Track Every Progress with <span className=" text-blue-400 text-8xl">Synview</span> </b> </p>
        
        <Form />
      </div>
    </div>
  );
}
