// Import any needed model functions (none are needed for the home page)

// Define any controller functions
const showHomePage = async (req, res) => {
    const title = 'Home';

    res.render('home', { title, activePage: 'home' });
};

// Export any controller functions
export { showHomePage };
