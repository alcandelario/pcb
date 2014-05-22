PCB
===
PCB is an under-development refactor of an app designed to manage printed circuit board (PCB) test data, notes and development milestones for Electrical Engineers.

Orgnanizations that cannot justify the cost of larger content management applications (SAP for example) tend to use manual, decentralized means of tracking data. This means lots of spreadsheets, no standards for document keeping and files haphazardly spread out on the engineering team's server.

PCB's goal is to simplify and organize test-data records and any notes/data related to a project's hardware development

Implementation
==============
Laravel 4.0 is used to create a RESTful API

AngularJS 1.3 is used for client-side single page navigation, simplifying XHR requests to the Laravel API, etc

Postgres SQL is used as the data store

Beyond any app-specific framework code, a parser feature was built to handle the import of HTML-based test data files

Yet to be completed porting an old-code feature to pipe test data into Google's chart API, to allow statistical analysis of test data

Issues
======
This project is a new port of a completely homebrew'd implementation and with the introduction of AngularJS for client-side interactivity, the project is in its infancy.

The API currently has several endpoints already to retrieve products, serial numbers, test attempts and test results.

The AngularJS frontend can currently handle user authentication and fetching a list of projects the user is associated with