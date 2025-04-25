import React, {useState} from 'react'

export default function page() {

    const [ course, setCourse] = useState ("");

      const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        let input = e.target as HTMLInputElement;
        let file = input.files?.[0]; // Use optional chaining in case no file is selected
      
        if (!file) {
          alert("No file selected :( ");
          return;
        }
      
        let formData = new FormData();
        formData.append('file', file);
      
        await fetch('/api/syllabus', {
          method: 'POST',
          body: formData,
        })
        .then(async (resp) => {
          if (resp.ok){
    
            const data = await resp.json();
            const folderId = data.folderId;
    
            if (!folderId) {
              alert('error fetching folder id')
            }
    
            alert('file uploaded successfully! Now redirecting to the canvas :)')
          }
          else {
            alert('Error uploading file. Try again :(')
          }
          })
        .then(data => {
          console.log(data);
        })
        .catch(error => console.log(error));
      };

  return (
    <>
    <p>upload the syllabus for the `${course}`</p>
    
    <form>
      <input type='file' onChange={handleUpload}/>
      <button className="w-12 h-12 flex items-center justify-center rounded-full bg-blue-500 text-white text-2xl hover:bg-blue-600">
      +
      </button>
      
    </form>

    </>
  )
}
