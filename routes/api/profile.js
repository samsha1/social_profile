const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const passport = require("passport");

//Load Validation
const validateProfileInput = require("../../validation/profile");
const validateExperienceInput = require("../../validation/experience");
const validateEducationInput = require("../../validation/education");

//Load Profile model
const Profile = require("../../models/Profile");

//Load User model
const User = require("../../models/User");

//@route GET api/profile/test
//@desc Test profile route
//@access Public

router.get("/test", (req, res) => res.json({ msg: "Profile Works" }));

//@route GET api/profile
//@desc Get Current User Profile
//@access Private

router.get(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const errors = {};
    Profile.findOne({ user: req.user.id })
      .populate("user", ["name", "avatar"])
      .then((profile) => {
        if (!profile) {
          errors.noprofile = "There is no profile for this user";
          return res.status(404).json(errors);
        }
        res.json(profile);
      })
      .catch((err) => res.status(404).json(err));
  }
);

//@route GET api/profile/all
//@desc Get All Profile
//@access Public

router.get("/all", (req, res) => {
  const errors = {};
  Profile.find()
    .populate("user", ["name", "avatar"])
    .then((profiles) => {
      if (!profiles) {
        errors.noprofile = "There is no profile for this user";

        return res.status(404).json(errors);
      }

      res.json(profiles);
    })
    .catch((err) =>
      res.status(400).json({ profile: "No profile for this user" })
    );
});

//@route GET api/profile/handle/:handle
//@desc Get User Profile by handle
//@access Public

router.get("/handle/:handle", (req, res) => {
  const errors = {};
  Profile.findOne({ handle: req.params.handle })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) =>
      res.status(400).json({ profile: "No Profile for this user" })
    );
});

//@route GET api/profile/:user_id
//@desc Get User Profile by id
//@access Public

router.get("/user/:user_id", (req, res) => {
  const errors = {};
  Profile.findOne({ user: req.params.user_id })
    .populate("user", ["name", "avatar"])
    .then((profile) => {
      if (!profile) {
        errors.noprofile = "There is no profile for this user";
        res.status(404).json(errors);
      }
      res.json(profile);
    })
    .catch((err) =>
      res.status(400).json({ profile: "No Profile for this user" })
    );
});

//@route POST api/profile
//@desc Create or Edit User Profile
//@access Private

router.post(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateProfileInput(req.body);
    //Check Validation
    if (!isValid) {
      //Return error response
      return res.status(400).json(errors);
    }
    //Get Fields
    const profileFields = {};
    profileFields.user = req.user.id;
    if (req.body.handle) profileFields.handle = req.body.handle;
    if (req.body.company) profileFields.company = req.body.company;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.location) profileFields.location = req.body.location;
    if (req.body.website) profileFields.website = req.body.website;
    if (req.body.bio) profileFields.bio = req.body.bio;
    if (req.body.status) profileFields.status = req.body.status;
    if (req.body.githubusername)
      profileFields.githubusername = req.body.githubusername;
    //Skills - split into array
    if (typeof req.body.skills !== "undefined") {
      profileFields.skills = req.body.skills.split(",");
    }
    //Social
    profileFields.social = {};
    if (req.body.youtube) profileFields.social.youtube = req.body.youtube;
    if (req.body.twitter) profileFields.social.twitter = req.body.twitter;
    if (req.body.facebook) profileFields.social.facebook = req.body.facebook;
    if (req.body.linkedin) profileFields.social.linkedin = req.body.linkedin;
    if (req.body.instagram) profileFields.social.indtagram = req.body.instagram;

    Profile.findOne({ user: req.user.id }).then((profile) => {
      if (profile) {
        //Update User
        Profile.findOneAndUpdate(
          { user: req.user.id },
          { $set: profileFields },
          { new: true }
        ).then((profile) => {
          res.json(profile);
        });
      } else {
        //Add User

        //Check Handle

        Profile.findOne({ handle: profileFields.handle }).then((profile) => {
          if (profile) {
            errors.handle = "Handle Already Exist";
            res.status(400).json(errors);
          } else {
            //Add User
            new Profile(profileFields).save().then((profile) => {
              res.json(profile);
            });
          }
        });
      }
    });
  }
);

//@route POST api/profile/experience
//@desc Add Experience to User Profile
//@access Private

router.post(
  "/experience",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateExperienceInput(req.body);
    //Check Validation
    if (!isValid) {
      //Return error response
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newExp = {
        title: req.body.title,
        company: req.body.company,
        location: req.body.location,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      profile.experience.unshift(newExp);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

//@route POST api/profile/education
//@desc Add Education to User Profile
//@access Private

router.post(
  "/education",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    const { errors, isValid } = validateEducationInput(req.body);
    //Check Validation
    if (!isValid) {
      //Return error response
      return res.status(400).json(errors);
    }
    Profile.findOne({ user: req.user.id }).then((profile) => {
      const newEdu = {
        school: req.body.school,
        degree: req.body.degree,
        fieldofstudy: req.body.fieldofstudy,
        from: req.body.from,
        to: req.body.to,
        current: req.body.current,
        description: req.body.description,
      };
      profile.education.unshift(newEdu);
      profile.save().then((profile) => res.json(profile));
    });
  }
);

//@route DELETE api/profile/experience:exp_id
//@desc Delete Experience from specific User Profile
//@access Private

router.delete(
  "/experience/:exp_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        //Get remove index
        const removeIndex = profile.experience
          .map((item) => item.id)
          .indexOf(req.params.exp_id);

        //Delete
        profile.experience.splice(removeIndex, 1);

        //save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json({ error: "Something Went Wrong!" }));
  }
);

//@route DELETE api/profile/education:edu_id
//@desc Delete Education from specific User Profile
//@access Private

router.delete(
  "/education/:edu_id",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOne({ user: req.user.id })
      .then((profile) => {
        //Get remove index
        const removeIndex = profile.education
          .map((item) => item.id)
          .indexOf(req.params.edu_id);

        //Delete
        profile.education.splice(removeIndex, 1);

        //save
        profile.save().then((profile) => res.json(profile));
      })
      .catch((err) => res.status(404).json({ error: "Something Went Wrong!" }));
  }
);

//@route DELETE api/profile/
//@desc Delete Education from specific User Profile
//@access Private

router.delete(
  "/",
  passport.authenticate("jwt", { session: false }),
  (req, res) => {
    Profile.findOneAndRemove({ user: req.user.id }).then(() => {
      User.findOneAndRemove({ _id: req.user.id }).then(() =>
        res.json({ success: true })
      );
    });
  }
);

module.exports = router;
