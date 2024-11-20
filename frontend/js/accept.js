document.addEventListener('DOMContentLoaded', function () {
    fetch('http://localhost:8080/ads/pending')
        .then(response => response.json())
        .then(pendingAds => {
            const container = document.getElementById('pendingAdsContainer');
            pendingAds.forEach(ad => {
                const adDiv = document.createElement('div');
                adDiv.className = 'col-md-4';
                adDiv.innerHTML = `
                    <div class="card mb-4">
                        <img src="${ad.imageUrls[0]}" class="card-img-top" alt="${ad.title}">
                        <div class="card-body">
                            <h5 class="card-title">${ad.title}</h5>
                            <p class="card-text">${ad.description}</p>
                            <p class="card-text"><strong>R$ ${ad.price}</strong></p>
                            <button class="btn btn-success" onclick="acceptAd(${ad.id})">Aceitar</button>
                        </div>
                    </div>
                `;
                container.appendChild(adDiv);
            });
        });
});

function acceptAd(adId) {
    fetch(`http://localhost:8080/ads/${adId}/accept`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        if (response.ok) {
            alert('Anúncio aceito com sucesso!');
            location.reload(); // Recarrega a página para ver os anúncios pendentes atualizados
        } else {
            alert('Erro ao aceitar o anúncio.');
        }
    });
}