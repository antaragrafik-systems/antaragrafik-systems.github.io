var sidebar_list = L.control.sidebar('sidebar_list', {
    closeButton: true,
    position: 'left',
    autoPan: false
});
sidebar_list.hide();
map.addControl(sidebar_list);
$("#btnList").click(function (e) {
    e.preventDefault();
    sidebar_list.toggle();
    document.getElementById('sidebar_list').hidden = false;
});