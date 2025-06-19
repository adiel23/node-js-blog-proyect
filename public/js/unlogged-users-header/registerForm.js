export function handleImgInputChange() {
    const imgPreview = document.getElementById('img-preview');

    const imgInput = document.getElementById('img-input');

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