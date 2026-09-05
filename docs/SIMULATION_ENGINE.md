# Discrete Event Simulation Engine

## Mathematical Modeling

### 1. Cycle Time & Maximum Capacity
For a machine $M_i$ with cycle time $T_{c,i}$ (in seconds):
$$\text{Throughput}_{\text{max}} = \frac{3600}{T_{c,i}} \quad (\text{units/hour})$$

### 2. Bottleneck Identification
The primary bottleneck machine $B$ is defined by:
$$B = \arg\max_{i} \left( \frac{\lambda_i}{\mu_i} \right)$$
where $\lambda_i$ is arrival rate and $\mu_i$ is service rate.

### 3. Buffer Queue Dynamics
Queue accumulation at station $i$ at time step $t+\Delta t$:
$$Q_i(t + \Delta t) = \max(0, Q_i(t) + (\text{Inflow}_i - \text{Outflow}_i) \cdot \Delta t)$$

### 4. Work-in-Progress (WIP) & Little's Law
$$L = \lambda W$$
where $L$ is average WIP inventory, $\lambda$ is throughput, and $W$ is total production lead time.
