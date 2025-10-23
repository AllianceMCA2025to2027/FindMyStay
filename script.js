//DOM Elements

// Hamburger Starts
const bars = document.querySelector(".fa-bars");
const mobileMenufixed = document.querySelector(".mobile-menu-fixed");
const menu = document.querySelector(".mobile-menu-container");

if(!bars || !mobileMenufixed || !menu){
    //Elements not found , dont run the script
}else{
    function openMenu(){
        mobileMenufixed.classList.add('is-open');
    };

    function closeMenu(){
        mobileMenufixed.classList.remove('is-open');
    };

    function toggleMenu(){
        if(mobileMenufixed.classList.contains('is-open')){
            closeMenu();
        }else{
            openMenu();
        };
    };
    

    //Toggle the menu on click
    bars.addEventListener('click',function(e){
        e.stopPropagation();
        toggleMenu();
    })

    //close when a link inside the menu is clicked
    menu.addEventListener('click', function(e){
        const link = e.target.closest('.mobile-menu-link');
        if(link){
            closeMenu();
        }
    })

    //close when clicked outside of the menu
    document.addEventListener('click',function(e){
        const clickInsideMenu = menu.contains(e.target);
        const clickedBars = bars.contains(e.target);
        if(!clickInsideMenu && !clickedBars){
            closeMenu();
        }
    })
};

// Hamburger Ends