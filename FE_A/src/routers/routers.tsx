import { Route, Routes } from 'react-router'
import PrivateRouters from './private.routers'
import AdminLayout from '@/pages/AdminLayout'
import Dashboard from '@/pages/dashboard/dashboard'
import Users from '@/pages/users/users'
import Analytics from '@/pages/analytics/analytics'
import ProductsAdd from '@/pages/products/products.add.pages'
import ProductsPage from '@/pages/products/products'
import ProductsUpdate from '@/pages/products/products.update.pages'
import Discounts from '@/pages/discounts/discounts'
import DiscountsAdd from '@/pages/discounts/discounts.add.pages'
import DiscountsUpdate from '@/pages/discounts/discounts.update.pages'
import Category from '@/pages/categories/categories'
import AddCategory from '@/pages/categories/addCategories'
import Orders from '@/pages/orders/orders'
import Coupons from '@/pages/coupons/coupons'
import Reviews from '@/pages/reviews/reviews'
import Register from '@/pages/register/register'
import Login from '@/pages/login/login'
import NotFound from '@/pages/NotFound'
import AddVariant from '@/pages/variants/variantsAdd'
import VariantsList from '@/pages/variants/variants'
import UpdateVariant from '@/pages/variants/variantsUpdate'
import OrderList from '@/pages/orders/orders'
import OrderDetailPage from '@/pages/orders/orderDetail'



const Routers = () => {
  const isAuthenticated = true

  return (
    <Routes>
      <Route element={<PrivateRouters isAllowed={isAuthenticated ? true : false} redirectTo='/signin' />}>
        <Route path='/' element={<AdminLayout />}>
          <Route index element={<Dashboard />} />
          <Route path='/analytics' element={<Analytics />} />
          <Route path='/users' element={<Users />} />
          <Route path='/products/add' element={<ProductsAdd />} />
          <Route path='/products' element={<ProductsPage />} />
          <Route path='/products/update/:id' element={<ProductsUpdate />} />
          <Route path='/variants' element={<VariantsList />} />
          <Route path='/variants/add' element={<AddVariant />} />
          <Route path='/variants/:id/edit' element={<UpdateVariant />} />
          <Route path='/discounts' element={<Discounts />} />
          <Route path='/orders' element={<OrderList />} />
          <Route path='/orders/:orderId' element={<OrderDetailPage />} />
          <Route path='/discounts/add' element={<DiscountsAdd />} />
          <Route path='/discounts/update/:id' element={<DiscountsUpdate />} />
          <Route path='/categories' element={<Category />} />
          <Route path='/categories/add' element={<AddCategory />} />
          <Route path='/orders' element={<Orders />} />
          <Route path='/coupons' element={<Coupons />} />
          <Route path='/reviews' element={<Reviews />} />
        </Route>
      </Route>
      <Route path='/register' element={<Register />} />
      <Route path='/login' element={<Login />} />
      <Route path='*' element={<NotFound />} />
    </Routes>
  )
}

export default Routers