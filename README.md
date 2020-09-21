# NeuroEvolution2D

<h2> What is neuroevolution? </h2> 
<p> 
Neuroevolution is a machine learning technique that applies evolutionary a
lgorithms to construct artificial neural networks, taking inspiration from
the evolution of biological nervous systems in nature. Compared to other neural 
network learning methods, neuroevolution is highly general; it allows learning without 
explicit targets, with only sparse feedback, and with arbitrary neural models and network structures. 
Neuroevolution is an effective approach to solving reinforcement learning problems, and is most commonly 
applied in evolutionary robotics and artificial life.
</p> 

<h2> About </h2> 
<p> 
A population 2D cars are spawned on a randomly generated track. The goal of each car is to travel the maximum possible distance until the next generation. 
If a car hits a wall it dies and is eliminated from the population. When a cars reaches the maximum fitness score for the track, the first iteration/generation is complete.
The best performing car from the previous generation is chosen and a new popultion is created fom this car by applying random changes to its brain (neural network). 
This process repeats over and over infinitely unless it is stopped, each time improving the performace of the cars from the previous generation. 
Each car has a neural network which makes a prediction about the speed and angle to apply at every instance until the end of the generation. This neural network acts as 
the brain of the car. 
The cars also have a certain range of vision which act as sensors. The inputs from these sensors goes to the car's brain and helps it make a decision on how to proceed.
At the end of the generation the best performing brain (fittest car) is chosen to move to the next generation and all the resulting cars of the next generation are derived from it. Just like in 
Natural Selection (survival of the fittest).
</p> 

<h2> Technical Aspects </h2> 
<p> 
This technique is a combination of neural networks and genetic algorithms. At the start of the process n number of neural networks are created with randomly initialized weights.
These are used to make predictions about what action to take based on inputs from the environment detected by sensors of the car. 
The best performing neural network is chosen and mutations are applied to its weights and a new population is initialized. 
The car sensors are basically 2D lines which are protruding out of the front of the car and use the raycasting algorithm to determine how close it is to a wall.
</p> 

<h2>References </h2>
<a href='http://www.scholarpedia.org/article/Neuroevolution'> What is NeuroEvolution </a> 
<a href='https://en.wikipedia.org/wiki/Ray_casting'> What is raycasting? </a> 
<a href='https://p5js.org/'> p5.js </a> - For drawing 2D graphics
<a href='https://www.youtube.com/user/shiffman'> Inspiration </a> 

