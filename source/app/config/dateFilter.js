app.filter('toYear', function () {
    return function (dateString) {
        var dateObject = new Date(dateString);
        var monthNames = ["January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        return dateObject.getUTCDate() + " " + monthNames[dateObject.getMonth()] + " "+ dateObject.getFullYear();
    };
});