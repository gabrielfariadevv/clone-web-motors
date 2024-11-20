document.addEventListener('DOMContentLoaded', async function () {
    const addImageUrlButton = document.getElementById('addImageUrlButton');
    const imageUrlContainer = document.getElementById('imageUrlContainer');

    // Adicionar campo de URL de imagem dinamicamente, mas limitar a 5
    addImageUrlButton.addEventListener('click', function () {
        const inputs = imageUrlContainer.getElementsByTagName('input');
        if (inputs.length < 5) { // Limita a 5 imagens
            const newImageUrlInput = document.createElement('input');
            newImageUrlInput.type = 'url';
            newImageUrlInput.classList.add('form-control', 'mb-2');
            newImageUrlInput.name = 'imageUrls[]';
            newImageUrlInput.required = true;
            imageUrlContainer.appendChild(newImageUrlInput);
        } else {
            alert('Você pode adicionar no máximo 5 URLs de imagens.');
        }
    });

    // Função para obter o token de autenticação
    function getAuthToken() {
        return localStorage.getItem('token');
    }

    // Função para verificar se o usuário está logado
    function isUserLoggedIn() {
        return getAuthToken() !== null; // Verifica se o token está presente no localStorage
    }

    // Função para obter o ID do usuário
    function getUserId() {
        return localStorage.getItem('userId');
    }

    // Função para renderizar os anúncios
    function renderAds(ads) {
        const adsRow = document.getElementById('adsRow');
        adsRow.innerHTML = '';

        ads.forEach((ad) => {
            // Exibir apenas a primeira foto
            const firstImage = ad.imageUrls[0];
            const imageTags = `<img src="${firstImage}" class="card-img-top" alt="${ad.title}" style="cursor: pointer;" onclick="showAdImages(${ad.id})">`;

            const adCard = `
                <div class="col-md-4 mb-4">
                    <div class="card">
                        ${imageTags}
                        <div class="card-body">
                            <h5 class="card-title">${ad.title}</h5>
                            <p class="card-text">${ad.description}</p>
                            <p class="card-text"><strong>Preço:</strong> R$ ${ad.price}</p>
                        </div>
                    </div>
                </div>
            `;
            adsRow.innerHTML += adCard;
        });
    }

    // Função para abrir o modal e exibir todas as imagens do anúncio
    window.showAdImages = function (adId) { // Acessível globalmente
        if (!isUserLoggedIn()) {
            alert("Você precisa estar logado para ver as imagens do anúncio.");
            return; // Impede que o modal seja exibido se o usuário não estiver logado
        }

        const ad = ads.find(a => a.id === adId); // Encontrar o anúncio pelo id
        const adImagesContainer = document.getElementById('adImagesContainer');
        adImagesContainer.innerHTML = ''; // Limpar o container

        // Adicionar todas as imagens no modal
        ad.imageUrls.forEach((url) => {
            const imgTag = `<img src="${url}" class="img-fluid mb-2" alt="Ad Image">`;
            adImagesContainer.innerHTML += imgTag;
        });

        // Exibir o modal
        const modal = new bootstrap.Modal(document.getElementById('adImagesModal'));
        modal.show();
    }

    // Função para buscar anúncios do backend
    async function getAds() {
        try {
            const response = await fetch('http://localhost:8080/ads', {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) throw new Error('Falha ao obter anúncios');
            return await response.json();
        } catch (error) {
            console.error('Erro ao obter anúncios:', error);
            return [];
        }
    }

    // Função para editar anúncio
    async function editAd(adId) {
        try {
            const response = await fetch(`http://localhost:8080/ads/${adId}`, {
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });
            if (!response.ok) throw new Error('Falha ao obter o anúncio');
            const ad = await response.json();

            document.getElementById('title').value = ad.title;
            document.getElementById('description').value = ad.description;
            document.getElementById('price').value = ad.price;

            // Preenche os campos de imagem
            const imageUrlContainer = document.getElementById('imageUrlContainer');
            imageUrlContainer.innerHTML = '';
            ad.imageUrls.forEach((url) => {
                const newImageUrlInput = document.createElement('input');
                newImageUrlInput.type = 'url';
                newImageUrlInput.classList.add('form-control', 'mb-2');
                newImageUrlInput.name = 'imageUrls[]';
                newImageUrlInput.value = url;
                imageUrlContainer.appendChild(newImageUrlInput);
            });

            document.getElementById('adForm').dataset.editingAdId = adId;

            const modal = new bootstrap.Modal(document.getElementById('addAdModal'));
            modal.show();
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível carregar o anúncio para edição.');
        }
    }

    // Função para deletar anúncio
    async function deleteAd(adId) {
        if (!confirm('Tem certeza que deseja excluir este anúncio?')) return;

        try {
            const response = await fetch(`http://localhost:8080/ads/${adId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${getAuthToken()}`
                }
            });

            if (!response.ok) throw new Error('Erro ao excluir o anúncio');

            const ads = await getAds();
            renderAds(ads);
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível excluir o anúncio. Tente novamente.');
        }
    }

    // Função para salvar ou atualizar anúncio
    document.getElementById('adForm').addEventListener('submit', async function (e) {
        e.preventDefault();

        if (!isUserLoggedIn()) {
            alert("Você precisa estar logado para adicionar um anúncio.");
            return; // Impede a submissão do formulário se o usuário não estiver logado
        }

        const title = document.getElementById('title').value;
        const description = document.getElementById('description').value;
        const price = document.getElementById('price').value;

        // Coletar todas as URLs das imagens
        const imageUrls = Array.from(document.querySelectorAll('input[name="imageUrls[]"]')).map(input => input.value);

        const adData = {
            title,
            description,
            price: parseFloat(price),
            imageUrls
        };

        const editingAdId = this.dataset.editingAdId;
        const url = editingAdId ? `http://localhost:8080/ads/${editingAdId}` : 'http://localhost:8080/ads';
        const method = editingAdId ? 'PUT' : 'POST';

        try {
            const response = await fetch(url, {
                method: method,
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getAuthToken()}`
                },
                body: JSON.stringify(adData)
            });

            if (!response.ok) throw new Error('Erro ao salvar o anúncio');

            const ads = await getAds();
            renderAds(ads);

            this.reset();
            delete this.dataset.editingAdId;
            const modal = bootstrap.Modal.getInstance(document.getElementById('addAdModal'));
            modal.hide();
        } catch (error) {
            console.error('Erro:', error);
            alert('Não foi possível salvar o anúncio. Tente novamente.');
        }
    });

    // Carregar os anúncios quando a página for carregada
    const ads = await getAds();
    renderAds(ads);
});
