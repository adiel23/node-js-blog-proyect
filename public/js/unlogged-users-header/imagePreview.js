export function handleImgInputChange(imagePreviewId, imageInputId) {
    const imgPreview = document.getElementById(imagePreviewId);

    const imgInput = document.getElementById(imageInputId);

    imgInput.addEventListener('change', async (event) => {
        const file = event.target.files[0];
        console.log(file);

        let imageUrl;

        const fileReader = new FileReader();

        fileReader.onload = event => {
            imageUrl = event.target.result;
            imgPreview.src = imageUrl;
        };

        fileReader.readAsDataURL(file);

    });
}