[gimmick: math]()
## One phaze solver

### Laplace operator boundary conditions

In 1d single phaze case, derivatives at the starting boundary and starting cells can be written as:

$$ \frac{\partial \phi}{\partial x} \vert_b = \frac{1}{\Delta x/2}(\phi_0-\phi_b) $$
$$ \frac{\partial \phi}{\partial x} \vert_0 = \frac{1}{2\Delta x}(\phi_0+\phi_1-2\phi_b) $$
$$ \frac{\partial \phi}{\partial x} \vert_1 = \frac{1}{2\Delta x}(\phi_2-\phi_0) $$
$$ \frac{\partial \phi}{\partial x} \vert_2 = \frac{1}{2\Delta x}(\phi_3-\phi_1) $$
