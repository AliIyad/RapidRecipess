const Features = () => {
  return (
    <section className='features-section'>
      <h2>Why Choose Rapid Recipes?</h2>
      <div className='features-grid'>
        <div className='feature'>
          <img src='icon1.png' alt='Share Recipes' />
          <h3>Share Your Creations</h3>
          <p>Share your favorite recipes and let others try them out!</p>
        </div>
        <div className='feature'>
          <img src='icon2.png' alt='Follow Chefs' />
          <h3>Follow Top Cooks</h3>
          <p>
            Find and follow chefs you love to stay up-to-date with their latest
            creations.
          </p>
        </div>
        <div className='feature'>
          <img src='icon3.png' alt='Community Feedback' />
          <h3>Connect with the Community</h3>
          <p>Like, comment, and share your cooking journey with others.</p>
        </div>
      </div>
    </section>
  );
};

export default Features;
