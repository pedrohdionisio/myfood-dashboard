import { PageLoader } from 'presentation/components/PageLoader/PageLoader';
import { AppError } from 'presentation/pages/AppError/AppError';
import { NotFound } from 'presentation/pages/NotFound/NotFound';
import type { RouteObject } from 'react-router-dom';
import { APP_ROUTES } from 'shared/routes/appRoutes';
import { SignedInGuard } from './SignedInGuard';
import { SignedOutGuard } from './SignedOutGuard';

export const routes: RouteObject[] = [
	{
		ErrorBoundary: AppError,
		HydrateFallback: PageLoader,
		children: [
			{
				Component: SignedOutGuard,
				children: [
					{
						path: APP_ROUTES.login,
						lazy: () =>
							import('presentation/pages/Login/Login').then(({ Login }) => ({ Component: Login }))
					},
					{
						path: APP_ROUTES.signUp,
						lazy: () =>
							import('presentation/pages/SignUp/SignUp').then(({ SignUp }) => ({
								Component: SignUp
							}))
					},
					{
						path: APP_ROUTES.forgotPassword,
						lazy: () =>
							import('presentation/pages/ForgotPassword/ForgotPassword').then(
								({ ForgotPassword }) => ({ Component: ForgotPassword })
							)
					},
					{
						path: APP_ROUTES.resetPassword,
						lazy: () =>
							import('presentation/pages/ResetPassword/ResetPassword').then(
								({ ResetPassword }) => ({ Component: ResetPassword })
							)
					}
				]
			},
			{
				Component: SignedInGuard,
				children: [
					{
						path: APP_ROUTES.restaurantOnboarding,
						lazy: () =>
							import('presentation/pages/RestaurantOnboarding/RestaurantOnboarding').then(
								({ RestaurantOnboarding }) => ({ Component: RestaurantOnboarding })
							)
					},
					{
						path: APP_ROUTES.restaurantSelection,
						lazy: () =>
							import('presentation/pages/RestaurantSelection/RestaurantSelection').then(
								({ RestaurantSelection }) => ({ Component: RestaurantSelection })
							)
					},
					{
						lazy: () =>
							import('presentation/templates/DashboardTemplate/DashboardTemplate').then(
								({ DashboardTemplate }) => ({ Component: DashboardTemplate })
							),
						children: [
							{
								path: APP_ROUTES.home,
								lazy: () =>
									import('presentation/pages/Home/Home').then(({ Home }) => ({ Component: Home }))
							},
							{
								path: APP_ROUTES.orders,
								lazy: () =>
									import('presentation/pages/Orders/Orders').then(({ Orders }) => ({
										Component: Orders
									}))
							},
							{
								path: APP_ROUTES.ordersHistory,
								lazy: () =>
									import('presentation/pages/OrdersHistory/OrdersHistory').then(
										({ OrdersHistory }) => ({ Component: OrdersHistory })
									)
							},
							{
								path: APP_ROUTES.reviews,
								lazy: () =>
									import('presentation/pages/Reviews/Reviews').then(({ Reviews }) => ({
										Component: Reviews
									}))
							},
							{
								path: APP_ROUTES.menuCategories,
								lazy: () =>
									import('presentation/pages/MenuCategories/MenuCategories').then(
										({ MenuCategories }) => ({ Component: MenuCategories })
									)
							},
							{
								path: APP_ROUTES.products,
								lazy: () =>
									import('presentation/pages/Products/Products').then(({ Products }) => ({
										Component: Products
									}))
							},
							{
								path: APP_ROUTES.team,
								lazy: () =>
									import('presentation/pages/Team/Team').then(({ Team }) => ({ Component: Team }))
							},
							{
								path: APP_ROUTES.settings,
								lazy: () =>
									import('presentation/pages/Settings/Settings').then(({ Settings }) => ({
										Component: Settings
									}))
							}
						]
					}
				]
			},
			{
				path: '*',
				Component: NotFound
			}
		]
	}
];
