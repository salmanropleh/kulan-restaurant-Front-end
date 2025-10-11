import React from "react";

const About = () => {
  return (
    <section className="py-20 bg-gray-50">
      <div className="container-custom section-padding">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div>
            <h2 className="text-4xl md:text-5xl font-display font-bold text-gray-900 mb-6">
              Our Story
            </h2>
            <p className="text-lg text-gray-600 mb-6">
              Since 2010, KULAN RESTAURANT has been serving exceptional cuisine
              in the heart of the city. Our passion for quality ingredients and
              authentic flavors has made us a beloved destination for food
              enthusiasts.
            </p>
            <p className="text-lg text-gray-600 mb-8">
              We believe that every meal should be an experience - from the
              carefully sourced ingredients to the attentive service and warm
              atmosphere that makes every guest feel at home.
            </p>
            <div className="flex space-x-4">
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">14+</div>
                <div className="text-gray-600">Years</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">10k+</div>
                <div className="text-gray-600">Happy Customers</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-primary mb-2">50+</div>
                <div className="text-gray-600">Awards</div>
              </div>
            </div>
          </div>
          <div className="relative">
            <img
              src="https://images.unsplash.com/photo-1555396273-367ea4eb4db5?ixlib=rb-4.0.3"
              alt="Restaurant interior"
              className="rounded-2xl shadow-lg"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
