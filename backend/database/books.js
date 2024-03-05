const books = [{
    userId:"1",
    title: "Le seigneur des Anneaux",
    author: "J.R.R Tolkien",
    imageUrl: "https://external-content.duckduckgo.com/iu/?u=https%3A%2F%2Fmedia.senscritique.com%2Fmedia%2F000007124067%2Fsource_big%2FLe_Seigneur_des_Anneaux.jpg&f=1&nofb=1&ipt=9875edfa84545a5495eca74acc00da77b456b919e552e541d97f2bb152fc4bb4&ipo=images",
    year:1955,
    genre: "Roman",
    ratings: [{
        userId:"1",
        grade: 5
    }],
    averageRating: 5


}]; // c'est une array avec un seul books

module.exports ={ books }; // on va exporter notre books