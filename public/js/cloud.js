/**
 * Created by Tamir on 19/05/2017.
 */
function cloud() {

    var icons = [
        'archive',
        'word',
        'text',
        'code',
        'image',
        'pdf',
        'video',
        'powerpoint',
        'audio',
        'excel'
    ];

    var icon;
    var background = document.getElementById('background');

    for (var i = 0; i < icons.length; i++) {

        var delay = Math.floor(Math.random() * 10);
        var duration = Math.floor(Math.random() * 10) + 5;
        var randomIcon = Math.floor(Math.random() * icons.length);

        icon = document.createElement('i');
        icon.id = 'file_' + i;
        icon.className = 'fa fa-file-' + icons[randomIcon] + '-o';
        icon.style.left = Math.floor(Math.random() * 90) + '%';
        icon.style.animation = 'fileUp ' + duration + 's linear infinite ' + delay + 's';
        background.appendChild(icon);

    }

    setInterval(function () {

        var num = Math.floor(Math.random() * 5)  + 1;
        console.log(num);

        $('#lock' + num).addClass('ok');

        setTimeout(function () {
            $('#lock' + num).removeClass('ok');
        }, 3000);

    }, 5000);

}