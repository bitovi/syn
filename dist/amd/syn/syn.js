/*syn/syn*/
define('syn/syn', [
    'syn/synthetic',
    'syn/mouse.support',
    'syn/browsers',
    'syn/key.support',
    'syn/drag/drag'
], function (syn) {
    window.syn = syn;
    return syn;
});
