<?php include('includes/header.php'); ?>



    <div id="main">
      <div class="container">
        <header class="span12">
          <h1>Register to Learn More</h1>
          <!-- NOTE: Design is inconsistent to when these should be titlecase -->
        </header> <!-- / wide header -->
      </div>
      <div class="container">
        <article class="span8">
          <p>
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. Phasellus quis tellus in nisl convallis iaculis sed cursus massa. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. nulla facilisi. ut vitae vulputate erat.
          </p>

          <form>
            <fieldset>
              <div class="form-field">
                <label for="first-name">First Name</label>
                <input type="text" name="first-name" id="first-name">
              </div>
              <div class="form-field">
                <label for="last-name">Last Name</label>
                <input type="text" name="last-name" id="last-name">
              </div>

              <div class="form-field">
                <label for="email">Email</label>
                <input type="text" name="email" id="email">
              </div>
              <div class="form-field">
                <label for="phone">Phone Number <em>(Optional)</em></label>
                <input type="text" name="" id="phone">
              </div>

              <div class="form-field">
                <label for="first-name">Location</label>
                <div class="radio-group">
                  <label>
                    <input type="radio" name="location" id="canada">
                     Canada
                  </label>
                  <label>
                    <input type="radio" name="location" id="other">
                     Other
                  </label>
                </div>
              </div>
              <!-- NOTE: Error can be reconfigured for validation library requirements -->
              <div class="form-field error">
                <label for="postal">Postal Code</label>
                <input type="text" name="postal" id="postal">
              </div>

              <div class="form-field">
                <label for="pick-password">Pick a Password</label>
                <input type="password" name="pick-password" id="pick-password">
              </div>
              <div class="form-field">
                <label for="confirm-password">Confirm Password</label>
                <input type="password" name="confirm-password" id="confirm-password">
              </div>

              <div class="form-field full-width">
                <label for="last-name">How did you hear about M? <em>(Optional)</em></label>
                <select name="">
                  <option value=""></option>
                </select>
              </div>

              <div class="form-field full-width">
                <label for="comments">Comments <em>(Optional)</em></label>
                <textarea name="comments" id="comments" rows="6" cols="5"></textarea>
              </div>

              <div class="form-submit">
                <button class="btn">Sign Up</button>
              </div>
            </fieldset>
          </form>

        </article>
        <aside class="span4">
          <div class="box login-callout">
            <a href="#" class="btn">Login</a>
            <h2>Already have an account?</h2>
          </div> <!-- / .box -->

          <div class="featured-quote">
            <blockquote>
              <p>Well, you know what they say: "stupid criminals make stupid cops". I'm proud to be chasing this guy.</p>
              <cite>- James McNulty</cite>
            </blockquote>
          </div>

        </aside> <!-- / sidebar -->
      </div> <!-- / .container -->
    </div> <!-- / #main -->
<?php include('includes/footer.php'); ?>